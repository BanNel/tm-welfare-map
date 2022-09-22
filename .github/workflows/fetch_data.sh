# Export google sheets to csv
publish_link="https://docs.google.com/spreadsheets/d/e/2PACX-1vQDOS-nGSjpPokBUxPKCTZ4L9vPzTEIKeHbC5CNd_Io99r4EKiJted_l54OvORKxqGIw9mpRmdwlG61/pub?gid=0&single=true&output=csv"
wget $publish_link -O poi.csv

# Convert csv to geojson
csv2geojson \
    poi.csv \
    ../../src/assets/data/poi.geojson \
    -include_columns status class subclass name description expiration start_date shop_url contract_url address
