# angularjs-source
Component Source for AngularJS

# installation
`npm install --save @mordelonjs/angularjs-source`

#### dependency
`npm install --save mordelon-js`

# usage
```
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular.min.js"></script>
<script src="./node_modules/mordelon-js/dist/index.es.js" type="module"></script>
<script src="./index.js"></script>
```

##### on index.js

```javascript
    // inject mordelon-angular dependency
   var app = angular.module("myApp", ["mordelon"]);
```

#### on html usage
* mordelon attribute
```html
    <div mordelon data-url="...">
<!--  ... component nested-->
    </div>
```
* or mordelon TAG
```html
    <mordelon>
<!--  ... component nested-->
    </mordelon>
```

#### mordelon tag or attribute configuration on attributes
~~~html
    <mordelon 
        url="string(default:'')" 
        paginate="bool(default:false)" 
        type="driverType(default:'url')"
        load="bool(default:false)"
    > ...
~~~

#### inside mordelon tag or attribute
~~~
$data = [] // contain data of source->proxy->drive->load()
$keys = [] // contain keys of data on source->proxy->drive->load()
$loading: true //status
$error: undefined // status fail
$prune: {start: 0, limit: 20} // object to paginate or ...
$filters: [] // filter array of Filter Interface => {field:'',operator:'==',value:undefined}
$sorter: {field: undefined, direction: "ASC"} // for sorting data with a sorter Interface 
$filtersChange: () => {…} // function to change filters
$pruneChange: () => {…} // function to change prune
$sorterChange: () => {…} // function to change sorter
$forceLoad: () => { Mordelon.ProxyPool.loadAll(); } //  Load all Proxy (dev purpouse)
$url: "...." // url for proxy config
$type: undefined // type of Drive for use on proxy (default='url')
$paginate: false // boolean default: false (for use pagination wrapper)
$load: undefined // boolean (default:false) for autoload source->proxy...
~~~

#### how use var inside mordelon (example on index.html)
~~~html
    <div mordelon data-url="https://jsonplaceholder.typicode.com/todos/" data-paginate="true" load="true">
        <!-- FORCE LOAD        -->
        <button type="button" ng-click="$m.$forceLoad()">CARGAR</button>
        
        <div ng-show="$m.$loading">
            <!-- showing loading proxy -->
            <h1>LOADING</h1>
        </div>
        
        <div ng-show="$m.$error">
            <!-- showing error on mordelon load -->
            <p>ERROR: {{ $m.$error }}</p>
        </div>
        
    <!--SHOW WHEN LOADING PROXY END WITHOUT FAIL-->
        <div ng-show="!$m.$loading && $m.$data">
            <!-- filter initialization   -->
            <span ng-init="$m.$filters = [{field:'firstname',operator:'%%',value:undefined},{field:'lastname',operator:'%%',value:undefined}]"></span>
            <!-- filter model touched            -->
            <input ng-model="$m.$filters[0].value" ng-change="$m.$filtersChange()" placeholder="firstname"/>
            <input ng-model="$m.$filters[1].value" ng-change="$m.$filtersChange()" placeholder="lastname"/>
            
            <!--  Pagination Data (only available with paginate=true)  -->
            <span>Desde: {{ $m.$from }}</span>
            <span>Hasta: {{ $m.$to }}</span>
            <span>Pagina: {{ $m.$currentPage }}</span>
            <span>Ultima Pagina: {{ $m.$lastPage }}</span>

            <!--buttons to paginate-->
            <button ng-click="$m.$previous()" type="button" ng-disabled="!$m.$hasPreviousPage()">ATRAS</button>
            <button ng-click="$m.$next()" type="button" ng-disabled="!$m.$hasNextPage()">NEXT</button>
            
            <!-- show data on Proxy Loader-->
            <table>
                <thead>
                    <th ng-repeat="property in $m.$keys">
                        <button type="button" ng-click="$m.$sorter.field = property;$m.$sorter.direction = $m.$sorter.direction == 'ASC' ? 'DESC' : 'ASC' ;$m.$sorterChange()">^</button> {{ property }}
                    </th>
                </thead>
                <tbody>
                <tr ng-repeat="item in $m.$data">
                    <span>{{item }}</span>
                    <td ng-repeat="property in $m.$keys">{{ item[property] }}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
~~~