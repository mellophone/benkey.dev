# Map Canvas Docs

[ Description here ]

## Classes

### World Manager

This is where the entire simulation is ran from. All other classes and functions are referenced from this master class.

### Image Loader

This is responsible for loading every image that will be used by the Map Canvas.

### Camera Manager

This class manages the "camera" that observes the world. This is done by returning the "zoom" style attribute of the Map Canvas's \<canvas> tag and two offset values for the x-direction and y-direction.
