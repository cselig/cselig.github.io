---
layout: post
title: Mapping Seattle Restaurant Health Data
date: 2019-09-16 00:00:00 -0800
categories: [blog]
---

The City of Seattle has some great resources for publically available data. I found [this][health-dataset] dataset for health inspection results and thought it would be interesting to visualize.

<!--excerpt-->

Getting the data was actually pretty easy through an API which exposes a bunch of publicly available data. Code can be found [here][code].

This map is broken down by zip code, with the metric being the grade that a restaurant received (more green -> better average rating). 

{% include blog/restaurant_health_map.html %}

Built with the awesome [leaflet.js][leaflet] library.


[health-dataset]: https://data.kingcounty.gov/Health-Wellness/Food-Establishment-Inspection-Data/f29f-zza5
[code]: https://github.com/cselig/seattle_restaurant_data/blob/master/generate_data.py
[leaflet]: https://leafletjs.com/
