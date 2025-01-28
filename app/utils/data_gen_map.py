import json
import random

# Load the existing GeoJSON file
with open('locations.geojson', 'r') as f:
    data = json.load(f)

# Create dark stores
dark_stores = []
for feature in data['features']:
    region = feature['properties']['region']
    coords = feature['geometry']['coordinates']
    
    # Create a dark store at a random location within 0.01 degrees of the region center
    store_lon = coords[0] + random.uniform(-0.01, 0.01)
    store_lat = coords[1] + random.uniform(-0.01, 0.01)
    
    dark_stores.append({
        "type": "Feature",
        "properties": {
            "region": region,
            "type": "dark_store"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [store_lon, store_lat]
        }
    })

# Create the new GeoJSON structure
new_geojson = {
    "type": "FeatureCollection",
    "features": data['features'] + dark_stores
}

# Save the new GeoJSON file
with open('dark_stores.geojson', 'w') as f:
    json.dump(new_geojson, f, indent=2)

print("Dark stores have been generated and saved to 'dark_stores.geojson'")
