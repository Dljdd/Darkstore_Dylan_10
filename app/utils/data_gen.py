import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Load the data from CSV files
demand_over_time = pd.read_csv('./biryani/demand_over_time.csv')
price_distribution = pd.read_csv('./biryani/price_distribution.csv')
demand_region_wise = pd.read_csv('./biryani/demand_region_wise.csv')
supply_region_wise = pd.read_csv('./biryani/supply_region_wise.csv')

# Create a date range for two years
start_date = datetime(2023, 1, 1)
end_date = start_date + timedelta(days=730)
date_range = pd.date_range(start=start_date, end=end_date, freq='D')

# Generate seasonal data
def generate_seasonal_data(date_range, demand_over_time):
    seasonal_data = pd.DataFrame({'ds': date_range})
    
    # Convert 'Month' to datetime and set as index
    demand_over_time['Month'] = pd.to_datetime(demand_over_time['Month'], format='%b')
    demand_over_time.set_index('Month', inplace=True)
    
    # Create monthly pattern
    monthly_pattern = demand_over_time['Demand: Chicken Biryani'].to_dict()
    seasonal_data['month'] = seasonal_data['ds'].dt.strftime('%b')
    seasonal_data['y'] = seasonal_data['month'].map(monthly_pattern)
    
    # Print debug information
    print("Monthly pattern:", monthly_pattern)
    print("Unique months in seasonal_data:", seasonal_data['month'].unique())
    print("Number of NaN values in 'y':", seasonal_data['y'].isna().sum())
    
    # Fill missing months with the mean
    mean_demand = demand_over_time['Demand: Chicken Biryani'].mean()
    seasonal_data['y'] = seasonal_data['y'].fillna(mean_demand)
    
    # Add yearly trend
    seasonal_data['y'] *= 1 + (seasonal_data.index // 365) * 0.1
    
    # Add weekly pattern
    seasonal_data['y'] *= 1 + 0.1 * np.sin(2 * np.pi * seasonal_data.index / 7)
    
    # Add noise
    seasonal_data['y'] += np.random.normal(0, seasonal_data['y'].std() * 0.1, len(seasonal_data))
    
    return seasonal_data

seasonal_data = generate_seasonal_data(date_range, demand_over_time)

# Add price effect
price_distribution['% orders: Chicken Biryani'] = price_distribution['% orders: Chicken Biryani'].str.rstrip('%').astype('float') / 100.0

def parse_price_bucket(bucket):
    parts = bucket.replace('+', '').split('-')
    return sum(float(part) for part in parts) / len(parts)

avg_price = (price_distribution['Price bucket (₹)  '].apply(parse_price_bucket) * price_distribution['% orders: Chicken Biryani']).sum()
price_effect = price_distribution['% orders: Chicken Biryani']
seasonal_data['y'] *= (1 + price_effect.sample(n=len(seasonal_data), replace=True).values)

# Add region-wise demand effect using one-hot encoding
regions = demand_region_wise['Location'].unique()
for region in regions:
    demand_value = demand_region_wise[demand_region_wise['Location'] == region]['Demand value'].values[0]
    seasonal_data[f'region_{region}'] = np.random.choice([0, 1], size=len(seasonal_data), p=[0.8, 0.2])
    seasonal_data['y'] *= 1 + (seasonal_data[f'region_{region}'] * demand_value / 100)

# Add supply constraints
total_supply = supply_region_wise['Supply value'].sum()
supply_weights = supply_region_wise['Supply value'] / total_supply
supply_effect = np.random.choice(supply_weights, size=len(seasonal_data))
seasonal_data['y'] = np.minimum(seasonal_data['y'], seasonal_data['y'] * supply_effect * 1.2)

# Ensure non-negative values
seasonal_data['y'] = np.maximum(seasonal_data['y'], 0)

# Save the generated seasonal data to a CSV file
seasonal_data.to_csv('./biryani/generated_seasonal_data.csv', index=False)

print("Seasonal data generated and saved to ./biryani/generated_seasonal_data.csv")
