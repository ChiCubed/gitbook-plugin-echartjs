# Extended Chart.js plugin for GitBook

A [Chart.js](http://www.chartjs.org/) wrapper for GitBook. Also see [here](https://github.com/chartjs/gitbook-plugin-chartjs).

However, this plugin is extended: an equation can be given, which is evaluated by the plugin and sent to Chart.js to be displayed.

The syntax is as follows for using normal Chart.js:

```
{% echartjs width="200px", height="100px", type="chart" %}
{
    ...
}
{% endechartjs %}
```

Put the Chart.js configuration in the object between the two tags. Width and height are obviously modifiable.

To draw an equation, use:

```
{% echartjs width="200px", height="100px", type="equation" %}
{
    "equation": "x^2",
    "start": 0,
    "stop": 100,
    "step": 10,
    "options": {
        ...
    }
}
{% endechartjs %}
```

(Note the `type="equation"` in the block.) This will create a chart with type 'scatter'. Any of the normal Chart.js options can be used within the 'options' object.

The equation will be considered to have a "y = " prepended to it, unless it contains a "y", in which case it will be considered to have a "x = " prepended to it.

Start, stop and step refer to the distance along the axis between each point that is drawn by the plugin. You can configure the scales using the 'options', as described [here](http://www.chartjs.org/docs/latest/axes/cartesian/linear.html).

### Important Note

The plugin will not render to PDF or other eBook formats since it uses an HTML5 canvas for rendering.

You can however create an image from the charts using this plugin, which will show up in all formats.

Set the 'renderPNG' option in the pluginsConfig in the `book.json`. This will generate an image above every chart in the webpage (when it is created as a webpage.) You can then save these images and replace the charts with the images, to allow it to render to PDF.

Note that a script is used to render the image, and therefore this plugin will not work with PDFs; you _must_ use images.

Sample `book.json`:

```
{
  "plugins": ["echartjs@git+https://github.com/ChiCubed/gitbook-plugin-echartjs"],
  "pluginsConfig": {
    "echartjs": {
      "renderPNG": true
    }
  }
}
```
