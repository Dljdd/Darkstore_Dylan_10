import json
import random

# Load the existing GeoJSON file
with open('locations.geojson', 'r') as f:
    data = json.load(f)

# Create a dictionary to store population density for each region
population_density = {}

# Generate random population density for each region
for feature in data['features']:
    region = feature['properties']['region']
    # Generate a random population density between 1000 and 30000 people per square km
    density = random.randint(1000, 30000)
    population_density[region] = density

# Save the population density data to a JSON file
with open('population_density.json', 'w') as f:
    json.dump(population_density, f, indent=2)

print("Population density data has been generated and saved to 'population_density.json'")

