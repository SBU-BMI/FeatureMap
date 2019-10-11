var viewer1 = {};
var viewer2 = {};
var viewer3 = {};
var viewer4 = {};

var x = OpenSeadragon.Filters.GREYSCALE;

function colorit(viewer) {

  x.prototype.COLORIZE = function (r, g, b) {
    return function (context, callback) {
      var imgData = context.getImageData(
        0, 0, context.canvas.width, context.canvas.height);
      var pixels = imgData.data;
      for (var i = 0; i < pixels.length; i += 4) {
        pixels[i] = r * pixels[i] / 255;
        pixels[i + 1] = g * pixels[i + 1] / 255;
        pixels[i + 2] = b * pixels[i + 2] / 255;
        pixels[i + 3] = 255;
      }
      context.putImageData(imgData, 0, 0);
      callback();
    };
  };

  viewer.setFilterOptions({
    filters: [{
      items: viewer.world.getItemAt(0),
      processors: [
        x.prototype.COLORIZE(255, 255, 0)
      ]
    }, {
      items: viewer.world.getItemAt(1),
      processors: [
        x.prototype.COLORIZE(255, 0, 0)
      ]
    }]
  });

}

function getWorldItems(viewer) {
  let i, tiledImage;
  let count = viewer.world.getItemCount();
  console.log("getItemCount:", count);
  for (i = 0; i < count; i++) {
    tiledImage = viewer.world.getItemAt(i);
    console.log(i + ":", tiledImage);
  }
}

function getMaxLevel(width, height) {
  // do natural logarithm (base e)
  if (width > height) {
    return Math.ceil(Math.log(width) / Math.log(2));
  } else {
    return Math.ceil(Math.log(height) / Math.log(2));
  }
}

function setViewer(id, imageArray, opacityArray) {
  let viewer = {};

  viewer = OpenSeadragon({
    id: id,
    prefixUrl: "//openseadragon.github.io/openseadragon/images/"
  });

  imageArray.forEach(function (image, index) {
    viewer.addTiledImage({
      tileSource: image,
      opacity: opacityArray ? opacityArray[index] : 0,
      x: 0,
      y: 0
    });
  });
  // console.log('viewer', viewer);
  return viewer;
}

function demo() {
  const wsi_w = 46336;
  const wsi_h = 44288;
  const max_l = getMaxLevel(wsi_w, wsi_h);
  const uno = 0.5;
  const due = 0.2;

  const img1 = {
    height: wsi_h,
    width: wsi_w,
    tileSize: 256,
    minLevel: 0,
    maxLevel: max_l,
    getTileUrl: function (level, x, y) {
      let host = "/caMicroscope/img/IIP/raw/?DeepZoom=/data/images/demo/dir1/TCGA-A2-A3XZ-01Z-00-DX1.svs_files/";
      return (host + level + "/" + x + "_" + y + ".png");
    }
  };

  const img2 = {
    height: wsi_h,
    width: wsi_w,
    tileSize: 256,
    minLevel: 0,
    maxLevel: max_l,
    getTileUrl: function (level, x, y) {
      let host = "/caMicroscope/img/IIP/raw/?DeepZoom=/data/images/demo/dir2/TCGA-A2-A3XZ-01Z-00-DX1.svs_files/";
      return (host + level + "/" + x + "_" + y + ".png");
    }
  };

  viewer1 = setViewer("viewer1", [img1, img2], [uno, due]);
  viewer2 = setViewer("viewer2", [img1, img2], [uno, due]);
  viewer3 = setViewer("viewer3", [img1, img2], [uno, due]);
  viewer4 = setViewer("viewer4", [img1, img2], [uno, due]);

  // TODO: FACTORY.
  var viewer1Leading = false;
  var viewer2Leading = false;

  var viewer1Handler = function () {
    if (viewer2Leading || viewer3Leading || viewer4Leading) {
      return;
    }

    viewer1Leading = true;
    viewer2.viewport.zoomTo(viewer1.viewport.getZoom());
    viewer2.viewport.panTo(viewer1.viewport.getCenter());
    viewer3.viewport.zoomTo(viewer1.viewport.getZoom());
    viewer3.viewport.panTo(viewer1.viewport.getCenter());
    viewer4.viewport.zoomTo(viewer1.viewport.getZoom());
    viewer4.viewport.panTo(viewer1.viewport.getCenter());
    viewer1Leading = false;
  };

  var viewer2Handler = function () {
    if (viewer1Leading || viewer3Leading || viewer4Leading) {
      return;
    }

    viewer2Leading = true;
    viewer1.viewport.zoomTo(viewer2.viewport.getZoom());
    viewer1.viewport.panTo(viewer2.viewport.getCenter());
    viewer3.viewport.zoomTo(viewer2.viewport.getZoom());
    viewer3.viewport.panTo(viewer2.viewport.getCenter());
    viewer4.viewport.zoomTo(viewer2.viewport.getZoom());
    viewer4.viewport.panTo(viewer2.viewport.getCenter());
    viewer2Leading = false;
  };

  viewer1.addHandler('zoom', viewer1Handler);  // When Viewer 1 is zooming we want Viewer 1 to lead
  viewer2.addHandler('zoom', viewer2Handler);
  viewer1.addHandler('pan', viewer1Handler);  // When Viewer 1 is panning we want Viewer 1 to lead
  viewer2.addHandler('pan', viewer2Handler);

  var viewer3Leading = false;
  var viewer4Leading = false;

  var viewer3Handler = function () {
    if (viewer2Leading || viewer1Leading || viewer4Leading) {
      return;
    }

    viewer3Leading = true;
    viewer1.viewport.zoomTo(viewer3.viewport.getZoom());
    viewer1.viewport.panTo(viewer3.viewport.getCenter());
    viewer2.viewport.zoomTo(viewer3.viewport.getZoom());
    viewer2.viewport.panTo(viewer3.viewport.getCenter());
    viewer4.viewport.zoomTo(viewer3.viewport.getZoom());
    viewer4.viewport.panTo(viewer3.viewport.getCenter());
    viewer3Leading = false;
  };

  var viewer4Handler = function () {
    if (viewer2Leading || viewer3Leading || viewer1Leading) {
      return;
    }

    viewer4Leading = true;
    viewer1.viewport.zoomTo(viewer4.viewport.getZoom());
    viewer1.viewport.panTo(viewer4.viewport.getCenter());
    viewer2.viewport.zoomTo(viewer4.viewport.getZoom());
    viewer2.viewport.panTo(viewer4.viewport.getCenter());
    viewer3.viewport.zoomTo(viewer4.viewport.getZoom());
    viewer3.viewport.panTo(viewer4.viewport.getCenter());
    viewer4Leading = false;
  };

  viewer3.addHandler('zoom', viewer3Handler);  // When Viewer 3 is zooming we want Viewer 3 to lead
  viewer4.addHandler('zoom', viewer4Handler);
  viewer3.addHandler('pan', viewer3Handler);  // When Viewer 3 is panning we want Viewer 3 to lead
  viewer4.addHandler('pan', viewer4Handler);

  return [viewer1, viewer2, viewer3, viewer4];
}