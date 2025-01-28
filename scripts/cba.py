import json
import numpy as np
from scipy.spatial.distance import cdist
from shapely.geometry import Point, shape
import geopandas as gpd
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def load_geojson(file_path): 
    with open(file_path, 'r') as f:
        return json.load(f)

def load_population_density(file_path):
    with open(file_path, 'r') as f:
        return json.load(f)

def find_region(lat, lon, regions_gdf):
    point = Point(lon, lat)
    for idx, region in regions_gdf.iterrows():
        if point.within(region.geometry):
            return region['region']
    logger.warning(f"No region found for coordinates ({lat}, {lon})")
    return None

def find_nearest_region(lat, lon, regions_gdf):
    point = Point(lon, lat)
    distances = regions_gdf.geometry.distance(point)
    nearest_idx = distances.idxmin()
    nearest_region = regions_gdf.loc[nearest_idx, 'region']
    logger.info(f"Nearest region for coordinates ({lat}, {lon}): {nearest_region}")
    return nearest_region

def calculate_distance_score(lat, lon, existing_stores):
    if existing_stores.empty:
        return 1.0  # If no existing stores, return max score
    distances = existing_stores.geometry.distance(Point(lon, lat))
    min_distance = distances.min()
    return 1 - np.exp(-min_distance / 2000)  # Exponential decay function, distance in meters

def calculate_demand_score(lat, lon, demand_data, regions_gdf):
    region = find_region(lat, lon, regions_gdf)
    if not region:
        region = find_nearest_region(lat, lon, regions_gdf)
    return demand_data.get(region, 0) / max(demand_data.values())

def calculate_store_score(lat, lon, population_density, existing_stores, demand_data, regions_gdf):
    region = find_region(lat, lon, regions_gdf)
    
    if not region:
        region = find_nearest_region(lat, lon, regions_gdf)
    
    density_score = population_density.get(region, 0) / max(population_density.values())
    distance_score = calculate_distance_score(lat, lon, existing_stores)
    demand_score = calculate_demand_score(lat, lon, demand_data, regions_gdf)
    
    weights = {
        'density': 0.4,
        'distance': 0.3,
        'demand': 0.3
    }
    
    final_score = (
        weights['density'] * density_score +
        weights['distance'] * distance_score +
        weights['demand'] * demand_score
    )
    
    logger.info(f"Scores - Density: {density_score}, Distance: {distance_score}, Demand: {demand_score}")
    logger.info(f"Final score: {final_score}")
    
    return final_score

def estimate_setup_cost(region):
    # Simplified estimation based on region
    base_cost = 500000  # Base setup cost
    region_factor = {
        'Urban': 1.2,
        'Suburban': 1.0,
        'Rural': 0.8
    }
    return base_cost * region_factor.get(region, 1.0)

def estimate_revenue(score, region):
    base_revenue = 1000000  # Base annual revenue
    return max(base_revenue * score * 1.5, 100000)  # Ensure minimum revenue of 100,000

def estimate_operational_cost(region):
    # Simplified operational cost estimation
    base_cost = 300000  # Base annual operational cost
    region_factor = {
        'Urban': 1.3,
        'Suburban': 1.0,
        'Rural': 0.7
    }
    return base_cost * region_factor.get(region, 1.0)

def perform_cost_benefit_analysis(lat, lon, population_density, existing_stores, demand_data, regions_gdf):
    region = find_region(lat, lon, regions_gdf)
    
    if not region:
        region = find_nearest_region(lat, lon, regions_gdf)
        logger.warning(f"Using nearest region: {region}")
    
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

# Main execution
if __name__ == "__main__":
    # Load data
    regions_geojson = load_geojson('locations.geojson')
    regions_gdf = gpd.GeoDataFrame.from_features(regions_geojson['features'])
    population_density = load_population_density('population_density.json')
    existing_stores = gpd.read_file('dark_stores.geojson')
    
    # Load or generate demand data (simplified for this example)
    demand_data = {region: np.random.randint(1000, 5000) for region in population_density.keys()}
    
    # Example usage
    new_store_lat, new_store_lon = 19.269359, 72.900638  # Example coordinates
    analysis_result = perform_cost_benefit_analysis(
        new_store_lat, new_store_lon, population_density, existing_stores, demand_data, regions_gdf
    )
    
    print(json.dumps(analysis_result, indent=2))
