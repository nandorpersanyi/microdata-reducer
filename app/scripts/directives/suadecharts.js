'use strict';

angular.module('suadeApp')
.directive('suadecharts', ['$rootScope','$timeout', function($rootScope,$timeout) {
    return {
        restrict: 'E',
        link: function($scope, $element, $attrs) {
            
            var chartid = Number($attrs.chartid);
            var charttype = $attrs.charttype;

            $element[0].id = $attrs.id;

            initiateCharts();

            function initiateCharts(){
                // If charts were already set, dispose crossfilter's old chart dimension objects, and set the new ones
                if($rootScope[$attrs.id])
                    $rootScope[$attrs.id].disposeChartDimension();
                // Create chart object
                $rootScope[$attrs.id] = new createChart(
                    $scope[charttype][chartid].charttype,
                    $scope[charttype][chartid].chartid,
                    $scope[charttype][chartid].chartkey,
                    $scope[charttype][chartid].width,
                    $scope[charttype][chartid].height,
                    $scope[charttype][chartid].xscale,
                    $scope[charttype][chartid].xscalesort,
                    $scope[charttype][chartid].xscaledomain,
                    $scope[charttype][chartid].centerbar,
                    $scope[charttype][chartid].event,
                    $scope[charttype][chartid].eventfunc,
                    $scope[charttype][chartid].ticknum,
                    $scope[charttype][chartid].tickswitchfunc,
                    $scope[charttype][chartid].positionlabel,
                    $scope[charttype][chartid].switchtitle);

                $rootScope[$attrs.id].getChartObj().render();
            }

            //Chart constructor
            function createChart(chartType,chartId,chartKey,width,height,xScale,xScaleSort,xScaleDomain,centerBar,event,eventFunc,tickNum,tickSwitchFunc,renderletFunc,switchTitle){
                if(chartType === 'bar'){
                    var chart  = dc.barChart(chartId);
                    var chartDimension = new dimensionConstructor(chartKey);
                } else if(chartType === 'pie'){
                    var chart  = dc.pieChart(chartId);
                    var chartDimension = new dimensionConstructor(chartKey);
                } else if(chartType === 'table'){
                    var chart  = dc.dataTable(chartId);
                    var chartDimension = new tableDimensionConstructor(chartKey);
                }
                

                var chartVar = chart
                    .width(width)
                    .height(height)
                    .dimension(chartDimension)
                if(chartType === 'bar' || chartType === 'pie'){
                    chartVar.group(snap_to_zero(groupDimensionVal(chartDimension)));
                } else if(chartType === 'table'){
                    chartVar.group(function (p) { return p.key });
                }
                if(chartType === 'table'){
                    chartVar.columns([
                        function(d) { return d.value; }
                    ]);
                    chartVar
                        .sortBy(function (d) { return d.key })
                        .size(50)
                        .sortBy(function (d) { return d.key })
                        .order(d3.descending)
                }
                if(xScale === 'ordinal' && !xScaleSort){
                    chartVar
                        .x(d3.scale.ordinal())
                        .xUnits(dc.units.ordinal)
                        .renderHorizontalGridLines(true);
                } else if(xScale === 'ordinal' && xScaleSort){
                    chartVar
                        .x(d3.scale.ordinal().domain(sortGroup(groupDimensionVal(chartDimension))))
                        .xUnits(dc.units.ordinal)
                        .renderHorizontalGridLines(true);
                } else if(xScale === 'linear'){
                    chartVar
                        .x(d3.scale.linear().domain([xScaleDomain[0],xScaleDomain[1]]))
                        .renderHorizontalGridLines(true)
                        .mouseZoomable(false);
                }

                if(chartType === 'pie')
                    chartVar.innerRadius(30);
                if(chartType === 'bar')
                    chartVar.yAxisLabel(yAxisLabel).elasticY(true);
                if(centerBar) 
                    chartVar.centerBar(true);
                if(event) 
                    chartVar.on(event, eventFunc);
                if(renderletFunc)
                    chartVar.renderlet(positionLabels);

                this.getChartObj = function(){
                    return chartVar;
                };
                this.getChartDimension = function(){
                    return chartDimension;
                };
                this.disposeChartDimension = function(){
                    chartDimension.dispose();
                };
            }
            //<< Chart Constructor

            //Charts Logic >>>
            //Crossfilter Logic >>
            //Crossfilter printer for debugging
            function print_filter(filter){
                var f=eval(filter);
                if (typeof(f.length) != "undefined") {}else{}
                if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
                if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
                console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
            }

            //Create Crossfilter instance
            //Crossfilter Logic Functions >>
            function dimensionConstructor(driver){
                var driver = driver;
                return $rootScope.dataMeta.crossFilterData.dimension(function(d) { return d[driver]; });
            }
            function tableDimensionConstructor(driver){
                var driver = driver;
                return $rootScope.dataMeta.crossFilterData.dimension(function(d) { return d[driver]; }).group().reduceCount();;
            }
            function groupDimensionVal(driverDimension){
                return driverDimension.group().reduceCount(function(d) {return d;});
            }
            //After filtering on the charts sometimes negative values appear in the graphs, it looks like these are infinitesimal negative numbers, which probably happen because of a glitch caused by floating point numbers not canceling out perfectly, the following function solves this issue by snapping really low values to zero
            function snap_to_zero(source_group) {
                return {
                    all:function () {
                        return source_group.all().map(function(d) {
                            return {key: d.key,
                                value: (Math.abs(d.value)<1e-6) ? 0 : d.value};
                        });
                    }
                };
            }
            function sortGroup(groupDimension) {
                var domain = [];
                groupDimension.top(Infinity).forEach(function(d) {
                    domain[domain.length] = d.key;
                });
                return domain;
            }
            //<< Crossfilter Logic

            //Reseting Filters >>
            $scope.resetChartFilter = function(chartInst){
                //Change eval!!!
                var chartObj = eval(chartInst);
                chartObj.getChartObj().filterAll();
                dc.redrawAll();
            };
            $scope.resetFilters = function(){
                dc.filterAll();
                dc.redrawAll();
            };
            //<< Reseting Filters

            //Chart reStyling >>
            var yAxisLabel = 'Number of Offences';
            
            function positionLabels(chart){
                chart.selectAll("g.x text")
                    .attr('transform', "rotate(90)")
                    .attr('dx', '7')
                    .attr('dy', '-6');
            }
            //<< Chart reStyling

        }
    }
}]);