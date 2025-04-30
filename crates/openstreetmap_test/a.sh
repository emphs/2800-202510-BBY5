
ZOOM=16

TILE_X=$(echo $tile_coords | cut -d',' -f1)
TILE_Y=$(echo $tile_coords | cut -d',' -f2)

URL="https://tile.openstreetmap.org/${ZOOM}/${TILE_X}/${TILE_Y}.png"

OUTPUT_FILE="map_tile_${ZOOM}_${TILE_X}_${TILE_Y}.png"

curl -o "$OUTPUT_FILE" "$URL"