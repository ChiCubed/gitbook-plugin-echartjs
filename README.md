# Extended Chart.js plugin for GitBook

A [Chart.js](http://www.chartjs.org/) wrapper for GitBook. Also see [here](https://github.com/chartjs/gitbook-plugin-chartjs).

However, this plugin is extended: an equation can be given, which is evaluated by the plugin and sent to Chart.js to be displayed.

The syntax is as follows for using normal Chart.js:

```
{% echartjs width="200", height="100", type="chart" %}
{
    ...
}
{% endechartjs %}
```

Put the Chart.js configuration in the object between the two tags. Width and height are obviously modifiable.

To draw an equation, use:

```
{% echartjs width="200", height="100", type="equation" %}
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

(Note the `type="equation"` in the block.) This will create a chart with type 'line'. Any of the normal Chart.js options can be used within the 'options' object.

Start, stop and step refer to the distance along the x-axis between each point that is drawn by the plugin. You can configure the scales using the 'options', as described [here](http://www.chartjs.org/docs/latest/axes/cartesian/linear.html).
