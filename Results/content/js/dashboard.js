/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 6;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6153846153846154, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "get bills end-point"], "isController": false}, {"data": [0.0, 500, 1500, "webhook delete end-point for Bill 1"], "isController": false}, {"data": [0.0, 500, 1500, "webhook_delete for Amount mismatch"], "isController": false}, {"data": [0.0, 500, 1500, "webhook delete end-point for Bill 3"], "isController": false}, {"data": [0.5, 500, 1500, "webhook delete end-point for Bill 2"], "isController": false}, {"data": [1.0, 500, 1500, "JSR223 Sampler_Callback validations"], "isController": false}, {"data": [1.0, 500, 1500, "onboard_error_404"], "isController": false}, {"data": [1.0, 500, 1500, "onboard_error_400"], "isController": false}, {"data": [1.0, 500, 1500, "JSR223 Sampler_Bill Information"], "isController": false}, {"data": [1.0, 500, 1500, "pay_Amount mismatch"], "isController": false}, {"data": [1.0, 500, 1500, "pay_Bill not found"], "isController": false}, {"data": [1.0, 500, 1500, "pay end-point for Bill 2"], "isController": false}, {"data": [1.0, 500, 1500, "pay end-point for Bill 3"], "isController": false}, {"data": [0.0, 500, 1500, "create webhook token"], "isController": false}, {"data": [1.0, 500, 1500, "pay end-point for Bill 1"], "isController": false}, {"data": [0.0, 500, 1500, "webhook get end-point for Bill 1"], "isController": false}, {"data": [0.0, 500, 1500, "webhook_get for Amount mismatch"], "isController": false}, {"data": [0.0, 500, 1500, "webhook get end-point for Bill 2"], "isController": false}, {"data": [1.0, 500, 1500, "pay end-point for Bill 4"], "isController": false}, {"data": [0.0, 500, 1500, "webhook get end-point for Bill 3"], "isController": false}, {"data": [0.5, 500, 1500, "JSR223 Sampler_Calculate JWT token"], "isController": false}, {"data": [1.0, 500, 1500, "pay end-point for Bill 5"], "isController": false}, {"data": [0.0, 500, 1500, "webhook get end-point for Bill 4"], "isController": false}, {"data": [0.0, 500, 1500, "webhook get end-point for Bill 5"], "isController": false}, {"data": [0.0, 500, 1500, "webhook delete end-point for Bill 5"], "isController": false}, {"data": [0.0, 500, 1500, "webhook delete end-point for Bill 4"], "isController": false}, {"data": [0.0, 500, 1500, "webhook_delete for Bill not found"], "isController": false}, {"data": [0.0, 500, 1500, "webhook_get for Bill not found"], "isController": false}, {"data": [1.0, 500, 1500, "onboard end-point"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 39, 0, 0.0, 1339.5641025641025, 1, 7145, 3446.0, 6457.0, 7145.0, 0.6179686262082079, 0.24755263627000476, 0.11056154432736492], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["get bills end-point", 1, 0, 0.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 250.0, 184.326171875, 72.998046875], "isController": false}, {"data": ["webhook delete end-point for Bill 1", 1, 0, 0.0, 2741.0, 2741, 2741, 2741.0, 2741.0, 2741.0, 0.36483035388544327, 0.0965517831083546, 0.09013874954396206], "isController": false}, {"data": ["webhook_delete for Amount mismatch", 1, 0, 0.0, 6457.0, 6457, 6457, 6457.0, 6457.0, 6457.0, 0.15487068297971193, 0.04098628426513861, 0.03826394804088586], "isController": false}, {"data": ["webhook delete end-point for Bill 3", 1, 0, 0.0, 1808.0, 1808, 1808, 1808.0, 1808.0, 1808.0, 0.5530973451327433, 0.14637634817477876, 0.13665393390486724], "isController": false}, {"data": ["webhook delete end-point for Bill 2", 1, 0, 0.0, 1276.0, 1276, 1276, 1276.0, 1276.0, 1276.0, 0.7836990595611285, 0.2074047315830721, 0.19362877155172414], "isController": false}, {"data": ["JSR223 Sampler_Callback validations", 7, 0, 0.0, 36.42857142857143, 2, 89, 89.0, 89.0, 89.0, 0.1366840450666823, 0.02284423632671392, 0.0], "isController": false}, {"data": ["onboard_error_404", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 200.0, 77.9296875, 51.3671875], "isController": false}, {"data": ["onboard_error_400", 1, 0, 0.0, 7.0, 7, 7, 7.0, 7.0, 7.0, 142.85714285714286, 33.90066964285714, 36.83035714285714], "isController": false}, {"data": ["JSR223 Sampler_Bill Information", 5, 0, 0.0, 5.8, 1, 24, 24.0, 24.0, 24.0, 0.16091658084449023, 0.025174644776647787, 0.0], "isController": false}, {"data": ["pay_Amount mismatch", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 83.33333333333333, 21.891276041666668, 32.389322916666664], "isController": false}, {"data": ["pay_Bill not found", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 200.0, 52.5390625, 74.8046875], "isController": false}, {"data": ["pay end-point for Bill 2", 1, 0, 0.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 71.42857142857143, 18.763950892857142, 27.762276785714285], "isController": false}, {"data": ["pay end-point for Bill 3", 1, 0, 0.0, 13.0, 13, 13, 13.0, 13.0, 13.0, 76.92307692307693, 20.20733173076923, 29.822716346153847], "isController": false}, {"data": ["create webhook token", 1, 0, 0.0, 2913.0, 2913, 2913, 2913.0, 2913.0, 2913.0, 0.34328870580157916, 0.2105325266048747, 0.10359004891864058], "isController": false}, {"data": ["pay end-point for Bill 1", 1, 0, 0.0, 14.0, 14, 14, 14.0, 14.0, 14.0, 71.42857142857143, 18.763950892857142, 27.69252232142857], "isController": false}, {"data": ["webhook get end-point for Bill 1", 1, 0, 0.0, 2689.0, 2689, 2689, 2689.0, 2689.0, 2689.0, 0.3718854592785422, 0.40711289047973226, 0.06101245816288583], "isController": false}, {"data": ["webhook_get for Amount mismatch", 1, 0, 0.0, 2669.0, 2669, 2669, 2669.0, 2669.0, 2669.0, 0.37467216185837393, 0.37796517890595727, 0.06146965155488947], "isController": false}, {"data": ["webhook get end-point for Bill 2", 1, 0, 0.0, 1779.0, 1779, 1779, 1779.0, 1779.0, 1779.0, 0.5621135469364812, 0.6159095699831366, 0.09222175379426645], "isController": false}, {"data": ["pay end-point for Bill 4", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 200.0, 52.5390625, 77.734375], "isController": false}, {"data": ["webhook get end-point for Bill 3", 1, 0, 0.0, 2874.0, 2874, 2874, 2874.0, 2874.0, 2874.0, 0.3479471120389701, 0.38328549060542794, 0.05708507306889352], "isController": false}, {"data": ["JSR223 Sampler_Calculate JWT token", 1, 0, 0.0, 645.0, 645, 645, 645.0, 645.0, 645.0, 1.550387596899225, 0.1907703488372093, 0.0], "isController": false}, {"data": ["pay end-point for Bill 5", 1, 0, 0.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 200.0, 52.5390625, 77.734375], "isController": false}, {"data": ["webhook get end-point for Bill 4", 1, 0, 0.0, 7145.0, 7145, 7145, 7145.0, 7145.0, 7145.0, 0.13995801259622115, 0.15335243177046887, 0.022961861441567533], "isController": false}, {"data": ["webhook get end-point for Bill 5", 1, 0, 0.0, 3446.0, 3446, 3446, 3446.0, 3446.0, 3446.0, 0.2901915264074289, 0.3182471524956471, 0.0476095473012188], "isController": false}, {"data": ["webhook delete end-point for Bill 5", 1, 0, 0.0, 3116.0, 3116, 3116, 3116.0, 3116.0, 3116.0, 0.32092426187419765, 0.08493210446084724, 0.07929085767008985], "isController": false}, {"data": ["webhook delete end-point for Bill 4", 1, 0, 0.0, 3393.0, 3393, 3393, 3393.0, 3393.0, 3393.0, 0.2947244326554671, 0.07799836059534336, 0.07281765767757148], "isController": false}, {"data": ["webhook_delete for Bill not found", 1, 0, 0.0, 2857.0, 2857, 2857, 2857.0, 2857.0, 2857.0, 0.35001750087504374, 0.0926315847042352, 0.08647893332166608], "isController": false}, {"data": ["webhook_get for Bill not found", 1, 0, 0.0, 6055.0, 6055, 6055, 6055.0, 6055.0, 6055.0, 0.16515276630883569, 0.1656366123038811, 0.027095375722543353], "isController": false}, {"data": ["onboard end-point", 1, 0, 0.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 83.33333333333333, 31.901041666666664, 23.92578125], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 39, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
