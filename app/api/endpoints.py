from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import pandas as pd
import pickle
from prophet import Prophet
from typing import List
import os
import json
import math
import logging
import geopandas as gpd
from shapely.geometry import Point
import numpy as np

logging.basicConfig(filename='api_debug.log', level=logging.DEBUG, 
                    format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

router = APIRouter()

# Load locations from GeoJSON file
with open('locations.geojson', 'r') as f:
    geojson_data = json.load(f)

locations_db = {}
for feature in geojson_data['features']:
    region = feature['properties']['region']
    coordinates = feature['geometry']['coordinates']
    locations_db[region] = coordinates

# Load the CSV data
csv_path = 'data/biryani/generated_seasonal_data.csv'
historical_data = pd.read_csv(csv_path)
historical_data['ds'] = pd.to_datetime(historical_data['ds'])

# Identify region columns (assuming they start with 'region_')
region_columns = [col for col in historical_data.columns if col.startswith('region_')]
logger.debug(f"Region columns found: {region_columns}")

# Create a 'region' column based on the binary encoded columns
historical_data['region'] = historical_data[region_columns].idxmax(axis=1).str.replace('region_', '')

# Log the columns of the historical data
logger.debug(f"Columns in historical data: {historical_data.columns}")

# Ensure we have data for all regions
all_regions = historical_data['region'].unique()
logger.debug(f"All regions in data: {all_regions}")

# Create a date range
date_range = pd.date_range(start=historical_data['ds'].min(), end=historical_data['ds'].max(), freq='D')

# Create a DataFrame with all combinations of dates and regions
all_combinations = pd.MultiIndex.from_product([date_range, all_regions], names=['ds', 'region'])
full_data = pd.DataFrame(index=all_combinations).reset_index()

# Merge with original data, filling missing values with 0
historical_data = pd.merge(full_data, historical_data, on=['ds', 'region'], how='left').fillna(0)

# Load the trained Prophet model
model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'prophet_model.pkl')
with open(model_path, 'rb') as f:
    model = pickle.load(f)

# Festival data
festivals = pd.DataFrame({
    'holiday': ['Diwali', 'Holi', 'Christmas', 'Eid'],
    'ds': pd.to_datetime(['2023-11-12', '2024-03-25', '2024-12-25', '2024-04-10'])
})

class ForecastRequest(BaseModel):
    future_days: int
    regions: List[str]
    festivals: Optional[List[str]] = None

class ForecastResponse(BaseModel):
    date: str
    forecast: float
    lower_bound: float
    upper_bound: float

def haversine_distance(lon1: float, lat1: float, lon2: float, lat2: float) -> float:
    R = 6371  # Earth's radius in kilometers
    dlon = math.radians(lon2 - lon1)
    dlat = math.radians(lat2 - lat1)
    a = (math.sin(dlat/2) * math.sin(dlat/2) +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon/2) * math.sin(dlon/2))
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    distance = R * c
    return distance

def get_nearby_areas(location: str, radius: float) -> List[str]:
    if location not in locations_db:
        raise ValueError(f"Location {location} not found in database")

    lon, lat = locations_db[location]
    nearby = []

    for area, (area_lon, area_lat) in locations_db.items():
        if area != location:
            distance = haversine_distance(lon, lat, area_lon, area_lat)
            if distance <= radius:
                nearby.append(area)

    return nearby

def calculate_demand_spike_score(location: str, radius: float, date: str) -> float:
    logger.debug(f"Calculating demand spike score for location={location}, radius={radius}, date={date}")
    
    # Convert date to datetime
    date = pd.to_datetime(date)
    
    # Consider a range of dates (e.g., 7 days before and after the given date)
    date_range = pd.date_range(start=date - pd.Timedelta(days=7), end=date + pd.Timedelta(days=7))
    
    # Filter data for the date range
    date_data = historical_data[historical_data['ds'].isin(date_range)]
    
    if date_data.empty:
        logger.warning(f"No data found for date range around {date}")
        return 0

    # Get the region column name for the given location
    location_column = f"region_{location.split(',')[0].strip()}"
    if location_column not in date_data.columns:
        logger.warning(f"No data found for location {location}")
        return 0

    # Get nearby areas
    nearby_areas = get_nearby_areas(location, radius)
    nearby_columns = [f"region_{area.split(',')[0].strip()}" for area in nearby_areas]
    nearby_columns = [col for col in nearby_columns if col in date_data.columns]

    # Calculate average demand for the location and nearby areas
    location_demand = (date_data[location_column] * date_data['y']).mean()
    nearby_demands = [(date_data[col] * date_data['y']).mean() for col in nearby_columns]

    total_demand = sum(nearby_demands) + location_demand
    average_demand = total_demand / (len(nearby_columns) + 1) if (len(nearby_columns) + 1) > 0 else 0

    logger.debug(f"Location demand: {location_demand}, Total demand: {total_demand}, Average demand: {average_demand}")

    if average_demand == 0:
        logger.warning(f"Average demand is zero, unable to calculate spike score")
        return 0

    spike_score = location_demand / average_demand
    logger.debug(f"Spike score: {spike_score}")

    return spike_score

class DemandSpikeRequest(BaseModel):
    location: str
    radius: float
    date: str

# Load population density data
with open('population_density.json', 'r') as f:
    population_density = json.load(f)

# Load existing stores data
existing_stores = gpd.read_file('dark_stores.geojson')

# Convert locations_db to GeoDataFrame
regions_gdf = gpd.GeoDataFrame(
    [{'region': k, 'geometry': Point(v[0], v[1])} for k, v in locations_db.items()]
)

@router.post("/forecast", response_model=List[ForecastResponse])
async def get_forecast(request: ForecastRequest):
    try:
        # Create future dataframe
        future = model.make_future_dataframe(periods=request.future_days)
        
        # Get all region columns from the model
        region_columns = [col for col in model.extra_regressors.keys() if col.startswith('region_')]
        
        # Initialize all region columns to 0
        for col in region_columns:
            future[col] = 0
        
        # Set requested regions to 1
        for region in request.regions:
            col_name = f'region_{region}'
            if col_name in region_columns:
                future[col_name] = 1
            else:
                print(f"Warning: Region '{region}' not found in model")
        
        # Add festival information
        for festival in festivals['holiday'].unique():
            future[festival] = 0
            festival_dates = festivals[festivals['holiday'] == festival]['ds']
            future.loc[future['ds'].isin(festival_dates), festival] = 1
        
        # Make prediction
        forecast = model.predict(future)
        
        # Prepare response
        response = []
        for _, row in forecast.tail(request.future_days).iterrows():
            response.append(ForecastResponse(
                date=row['ds'].strftime('%Y-%m-%d'),
                forecast=row['yhat'],
                lower_bound=row['yhat_lower'],
                upper_bound=row['yhat_upper']
            ))
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/demand-spike-score")
async def get_demand_spike_score(request: DemandSpikeRequest):
    try:
        spike_score = calculate_demand_spike_score(request.location, request.radius, request.date)
        return {"location": request.location, "radius": request.radius, "date": request.date, "demand_spike_score": spike_score}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def find_region(lat: float, lon: float, regions_gdf: gpd.GeoDataFrame) -> str:
    point = Point(lon, lat)
    for idx, region in regions_gdf.iterrows():
        if point.within(region.geometry.buffer(0.01)):  # Add small buffer for point-in-polygon check
            return region['region']
    return find_nearest_region(lat, lon, regions_gdf)

def find_nearest_region(lat: float, lon: float, regions_gdf: gpd.GeoDataFrame) -> str:
    point = Point(lon, lat)
    distances = regions_gdf.geometry.distance(point)
    nearest_idx = distances.idxmin()
    return regions_gdf.loc[nearest_idx, 'region']

def calculate_distance_score(lat: float, lon: float, existing_stores: gpd.GeoDataFrame) -> float:
    if existing_stores.empty:
        return 1.0
    distances = existing_stores.geometry.distance(Point(lon, lat))
    min_distance = distances.min()
    return 1 - np.exp(-min_distance / 2000)

def calculate_demand_score(region: str, demand_data: Dict[str, float]) -> float:
    return demand_data.get(region, 0) / max(demand_data.values())

def calculate_store_score(lat: float, lon: float, population_density: Dict[str, float], existing_stores: gpd.GeoDataFrame, demand_data: Dict[str, float], regions_gdf: gpd.GeoDataFrame) -> float:
    region = find_region(lat, lon, regions_gdf)
    
    density_score = population_density.get(region, 0) / max(population_density.values())
    distance_score = calculate_distance_score(lat, lon, existing_stores)
    demand_score = calculate_demand_score(region, demand_data)
    
    weights = {'density': 0.4, 'distance': 0.3, 'demand': 0.3}
    
    final_score = (
        weights['density'] * density_score +
        weights['distance'] * distance_score +
        weights['demand'] * demand_score
    )
    
    return final_score

def estimate_setup_cost(region: str) -> float:
    base_cost = 500000
    region_factor = {'Urban': 1.2, 'Suburban': 1.0, 'Rural': 0.8}
    return base_cost * region_factor.get(region.split(',')[0].strip(), 1.0)

def estimate_revenue(score: float, region: str) -> float:
    base_revenue = 1000000
    return max(base_revenue * score * 1.5, 100000)

def estimate_operational_cost(region: str) -> float:
    base_cost = 300000
    region_factor = {'Urban': 1.3, 'Suburban': 1.0, 'Rural': 0.7}
    return base_cost * region_factor.get(region.split(',')[0].strip(), 1.0)

def perform_cost_benefit_analysis(lat: float, lon: float, population_density: Dict[str, float], existing_stores: gpd.GeoDataFrame, demand_data: Dict[str, float], regions_gdf: gpd.GeoDataFrame) -> Dict[str, Any]:
    region = find_region(lat, lon, regions_gdf)
    score = calculate_store_score(lat, lon, population_density, existing_stores, demand_data, regions_gdf)
    
    setup_cost = estimate_setup_cost(region)
    annual_revenue = estimate_revenue(score, region)
    annual_operational_cost = estimate_operational_cost(region)
    
    net_annual_profit = annual_revenue - annual_operational_cost
    payback_period = setup_cost / net_annual_profit if net_annual_profit > 0 else float('inf')
    
    return {
        'score': score,
        'region': region,
        'setup_cost': setup_cost,
        'annual_revenue': annual_revenue,
        'annual_operational_cost': annual_operational_cost,
        'net_annual_profit': net_annual_profit,
        'payback_period': payback_period
    }

class CostBenefitRequest(BaseModel):
    latitude: float
    longitude: float

@router.post("/cost-benefit-analysis")
async def get_cost_benefit_analysis(request: CostBenefitRequest):
    try:
        # Generate simple demand data (replace this with actual demand data if available)
        demand_data = {region: np.random.randint(1000, 5000) for region in population_density.keys()}
        
        analysis_result = perform_cost_benefit_analysis(
            request.latitude,
            request.longitude,
            population_density,
            existing_stores,
            demand_data,
            regions_gdf
        )
        return analysis_result  # Return the full analysis result
    except Exception as e:
        logger.error(f"Error in cost-benefit analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


class Coordinates(BaseModel):
    latitude: float
    longitude: float


