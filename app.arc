@app
mattlovan

# @aws
# profile default
# region us-west-1

@static
folder public

@http
get /rebuild
get /position/:position
get /week/:week
get /image/:playerDkId

# Player
post /player/:playerDkId
get /player/:playerDkId

# @scheduled
# refresh-data rate(10 seconds)

@events
player-updated
player-image-build

@tables
playerweek
  playerDkId *Number


