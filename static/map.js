var margin = {top: 1, right: 1, bottom: 1, left: 1},
            width = 980 - margin.left - margin.right,
            height = 450 - margin.top - margin.bottom;
        
        d3.queue()
        .defer(d3.json,"https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/romania.geojson")
        .defer(d3.csv, "static/event_coords_data.csv")
        .await(ready)
        
        var canvas = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class","canvas")
        .call(d3.zoom().on("zoom",function(){
            canvas.attr("transform", d3.event.transform).transition().duration(100)
        }))
        .append("g");
        
        var data1=d3.json("https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/romania.geojson")
        var data2=d3.csv("static/event_coords_data.csv")
        
        var scale = 200;
        var projection = d3.geoMercator().scale(scale).translate([width / 2, height / 2]);
        
        console.log(data2);
        
        function ready(error, data1, data2){
            console.log(data2);
            var g = canvas.selectAll("g")
            .data(data1.features)
            .enter();
            
            
            
            var projection = d3.geoMercator().center([100, 47]).scale(scale).translate([width / 2, height / 1.5]);
            var path = d3.geoPath().projection(projection);
            
            var areas = g.append("path")
            .attr("d", path)
            .attr("class", "area")
            .attr("fill", "#8FBC8F")
            .attr("stroke", "black")
            .attr("stroke-width",.1)
            .attr("cursor", "pointer");
            
            d3.selectAll('#map').attr("transform", "scale(100)");
            
            g = canvas.append("g");
            
             var colorScale = d3.scaleLinear()
            .domain([20, d3.max(data2, function(d){
                return d.CoL;
            })])
            .range(["yellow", "red"]);
            
             var tip = d3.tip()
                .attr("class", "d3-tip")
                .offset([-10, 0])
                .html(function(d) {
                    
                   return "Város: " + d.city_name + "<br>" + "Esemény: " + d.event + "<br>" ;
                //console.log(d.x_coord)
                            /*"Country: " + d.Country + "<br>" +
                                "Cost of Living Index: " + d.CoL; */
                    
                });
                    

            canvas.call(tip);
            
             
            
            g.selectAll(".city-circle")
            .data(data2)
            .enter()
            .append("circle")
            .attr("stroke","black")
            .attr("r",.2)
            .attr("cx", function(d){
                var coordinates = projection([d.x_coord, d.y_coord])
                return coordinates[0];
            })
            .attr("cy", function(d){
                var coordinates = projection([d.x_coord, d.y_coord])
                return coordinates[1];
            })
            .attr("fill", function(d){ return colorScale(d.CoL)}).style("opacity",.7)
            .on("mouseover",tip.show).attr("cursor","pointer")
            .on("mouseout", tip.hide);
        }
