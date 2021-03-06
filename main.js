/**
 * Created by pratima on 4/22/2016.
 */
(function(){
    var items = [];
    var gendata=[];
    var countrydata=[];
    gendata.push(["Year","action","drama"])
    var data={};
    $("#compare").click(function(e)
    {
        e.preventDefault();
        console.log(gendata);
        drawsecondQueryChart();

    });

    $("#country").click(function(e)
    {
        e.preventDefault();

        $.ajax({
            dataType: "json",
            url: 'coutnry.json',
            async: false,
            data: data,
            success: function( data ) {
                //consol.log("success");
                $.each(data.results.bindings, function (i, item) {
                    var row = [];
                    var country=item.country_name.value;
                    row.push(country.replace(" (country)",""));
                    //console.log("year "+item.year.value);
                    row.push(parseFloat(item.count.value));
                    // console.log("count "+item.count.value);
                    countrydata.push(row);
                    //console.log("row "+row);
                });

                console.log(countrydata);

            }

        });
        drawRegionsMap();
    });

    $("#first").click(function(e)
    {
        e.preventDefault();
        $.ajax({
            dataType: "json",
            url: 'Action.json',
            async: false,
            data: data,
            success: function( data ) {

                $.each(data.results.bindings, function (i, item) {
                    var row = [];
                    row.push(parseFloat(item.year.value));
                    //console.log("year "+item.year.value);
                    row.push(parseFloat(item.count.value));

                    row.push(parseFloat(0));
                    // console.log("count "+item.count.value);
                    gendata.push(row);
                    //console.log("row "+row);
                });
                //console.log(gendata);
            }
            //console.log(items[0]);
        });

    });

    $("#second").click(function(e)
    {
        e.preventDefault();
        var isthere=false;
        $.ajax({
            dataType: "json",
            url: 'Drama Year.json',
            async: false,
            data: data,
            success: function( data ) {

                $.each(data.results.bindings, function (i, item) {

                    $.each(gendata, function (i, row) {
                         if(row[0]===parseFloat(item.year.value))
                         {
                             row[2]=parseFloat(item.count.value);
                             isthere=true;
                             console.log("in here" + row[2]+" "+row[0]);
                             return false;
                         }
                    });
                        if(isthere==false)
                        {
                            var row1 = [];
                            row1.push(parseFloat(item.year.value));
                            //console.log("year "+item.year.value);
                            row1.push(parseFloat(0));
                            row1.push(parseFloat(item.count.value));


                            // console.log("count "+item.count.value);
                            gendata.push(row1);
                            //console.log("row "+row);
                        }
                    isthere=false;
                });
            }
            //console.log(items[0]);
        });

    });

    items.push(['year','count']);
    countrydata.push(["country","count"]);
    $.ajax({
        dataType: "json",
        url: 'queryResults.json',
        async: false,
        data: data,
        success: function( data ) {

            $.each(data.results.bindings, function (i, item) {
                var row = [];
                row.push(parseFloat(item.year.value));
                //console.log("year "+item.year.value);
                row.push(parseFloat(item.count.value));
                // console.log("count "+item.count.value);
                items.push(row);
                //console.log("row "+row);
            });
        }
        //console.log(items[0]);
    });



    console.log(JSON.stringify(items));
    google.charts.load('current', {'packages':['corechart','bar','geochart']});
    google.charts.setOnLoadCallback(drawChart);
   // google.charts.setOnLoadCallback(drawRegionsMap);

    function drawChart() {
        var data = google.visualization.arrayToDataTable(items);

        var options = {
            title: 'number of movies over 100 years',
            curveType: 'function',
            legend: { position: 'bottom' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        chart.draw(data, options);
    }

    //google.charts.load('current', {'packages':['bar']});
  //  google.charts.setOnLoadCallback(drawsecondQueryChart);
    function drawRegionsMap() {
       // console.log(countrydata);
        var data = google.visualization.arrayToDataTable(countrydata);

        var options = {
            colorAxis: {colors: ['#00853f', 'black', '#e31b23']},
            backgroundColor: '#81d4fa',
            datalessRegionColor: '#f8bbd0',
            defaultColor: '#f5f5f5',
        };

        var chart = new google.visualization.GeoChart(document.getElementById('geochart-colors'));
        chart.draw(data, options);
    };
    function drawsecondQueryChart() {
        var items=[];
        var col=[];
        col.push("year");
        col.push($("#first").val());
        col.push($("#second").val());
        items.push(col);
        items.push(['2014', 1000, 400]);
        items.push(['2015', 1170, 460]);
        items.push(['2016', 660, 1120]);

        var data = google.visualization.arrayToDataTable(gendata);

        var options = {
            chart: {
                title: 'Company Performance',
                subtitle: 'Sales, Expenses, and Profit: 2014-2017',
            }
        };

        var chart = new google.charts.Bar(document.getElementById('columnchart_material'));

        chart.draw(data, options);
    }


})();
