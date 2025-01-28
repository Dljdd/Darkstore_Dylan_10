import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

# Read the generated seasonal data
df = pd.read_csv('./biryani/generated_seasonal_data.csv')
df['ds'] = pd.to_datetime(df['ds'])

# Read the demand_region_wise data to get the list of regions
demand_region_wise = pd.read_csv('./biryani/demand_region_wise.csv')
regions = demand_region_wise['Location'].unique()

# Create one-hot encoded columns for regions
for region in regions:
    df[f'region_{region}'] = np.random.choice([0, 1], size=len(df), p=[0.8, 0.2])

# Plot the data for each region
plt.figure(figsize=(15, 10))
for region in regions:
    region_data = df[df[f'region_{region}'] == 1]
    plt.plot(region_data['ds'], region_data['y'], label=region, alpha=0.7)

plt.title('Chicken Biryani Demand by Region')
plt.xlabel('Date')
plt.ylabel('Demand')
plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
plt.tight_layout()
plt.show()

# Plot heatmap of demand across regions and time
pivot_df = df.pivot_table(values='y', index=df['ds'].dt.to_period('M'), 
                          columns=regions, aggfunc='mean')
plt.figure(figsize=(15, 10))
sns.heatmap(pivot_df, cmap='YlOrRd', annot=False)
plt.title('Heatmap of Chicken Biryani Demand Across Regions and Time')
plt.xlabel('Region')
plt.ylabel('Month')
plt.tight_layout()
plt.show()

# Plot boxplot of demand distribution for each region
plt.figure(figsize=(15, 10))
region_data = []
for region in regions:
    region_data.append(df[df[f'region_{region}'] == 1]['y'])

plt.boxplot(region_data, labels=regions)
plt.title('Distribution of Chicken Biryani Demand by Region')
plt.xlabel('Region')
plt.ylabel('Demand')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()