# Product

## Vision
Easy way for anyone to get an overview of a large amount of photos from different vendors and sources.

## Features
#### Show photos
> Either import them or just show them via url. Facebook, Instagram, Snapchat, Google Drive, Dropbox, iCloud, OneDrive etc.

#### Share photos/albums/sources
> To relatives, friends etc.

#### Create albums?
> Or some other user feature that will get users to buy in with an emotional attachment. We want users to create content with our product that they want to return to.

#### Tags
> Can extract tags from metadata? Ability to add tags in front-end?

#### Import my photos from different vendors
> Not clear how much metadata is stored within each provider? E.g. iPhone camera includes everything from GPS info to timestamp but photos taken by Snapchat stores hardly any metadata.

#### Import friend's photos from different vendors

#### Delete duplicate photos

#### Personalization
Both automatic and manual identification of persons and places etc...

#### Search and filter
> Search on metadata, tags, vendor data, image recognition etc.

#### Filter search by "sort my best"

#### Smart image tagging (automatic or suggestions)

#### Basic image manipulation

## Scope
What do we start with?

### v0.1
- Access photos from one vendor/source (Google Drive)
- Show photos
- Host with docker/VPS

### 0.2
- Search meta-data on date and place

# Tech stack

## Back-end
### Storage
- Separate writes from search
- Search with Elastic Search
- Master database, SQL or mongoDB? 

### Micro services
v0.1 and 0.2
node.js

### Image recognition?
OpenCV, MS Cognitive Services, Google, Amazon...

## Front-end

### React
Focus on vanilla js...
