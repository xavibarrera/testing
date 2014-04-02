/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        initJquery();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //alert(id);
    }
};

function requestSuccess(htmlData) {
    alert(htmlData);
}

// MODEL
function ViewModel() {
    var self = this;

    self.process            = ko.observable('stopped');
    self.jsonData           = ko.observable('');
    self.imgPath            = ko.observable('');
    self.imgVisible         = ko.observable(false);
    self.processInitialized = ko.observable(false);
    self.wantSandbox        = ko.observable(true);
    self.copyFreeBaseJSON   = ko.observable(true);
    self.longProcess        = ko.observable(true);
    self.processPanelHeight = ko.computed(function() {
        return this.processInitialized()?'175px':'83px';
    }, this);
}
var myViewModel = new ViewModel();

$("#screen1").on( "pagecreate", function( event ) {
    ko.applyBindings(myViewModel);
    $('#sandbox').attr('checked',myViewModel.wantSandbox()).checkboxradio('refresh');
    $('#jsonCalc').attr('checked',myViewModel.copyFreeBaseJSON()).checkboxradio('refresh');
    $('#longLoop').attr('checked',myViewModel.longProcess()).checkboxradio('refresh');

    //FastClick.attach(document.body);
} );

var searchTopic = 'game_of_thrones'
var freeBaseImg = '';


function startBackgroundProcess() {
    if (!myViewModel.processInitialized()) {
        myViewModel.processInitialized(true);
        startFreeBaseSearch();
    }   
}

function stopBackgroundProcess() {
    resetModel();
    myViewModel.processInitialized(false);
}

function resetModel() {
     myViewModel.process('stopped');
     myViewModel.jsonData('');
     myViewModel.imgPath('');
     myViewModel.imgVisible(false);
}

function resetAndScheduleBackgroundProcess() {
    if (!myViewModel.processInitialized()) {
        resetModel();
        return;
    }

    myViewModel.process('scheduled for 2"');
    freeBaseImg = '';
    setTimeout(startFreeBaseSearch, 2000); 
}

function startFreeBaseSearch(){
   resetModel();
   if (!myViewModel.processInitialized()) {
        return;
   }

   myViewModel.process('search for Game Of Thrones started...');
   var freebaseV = myViewModel.wantSandbox()? 'v1sandbox' : 'v1';
   $.ajax({
        url: 'https://www.googleapis.com/freebase/'+freebaseV+'/search?query='+searchTopic,
        type: "GET",
        dataType: "jsonp",
        async:false,
        success: function (msg) {freeBaseSearchCallback(msg);},
        error: function (xhr, status, exception) {freeBaseError(xhr, status, exception);}
    });
}

function freeBaseSearchCallback(json) {
    var validResponse = json && json.status && json.result && json.status == '200 OK';

    if (!myViewModel.processInitialized() || !validResponse) {
        resetModel();
        return;
    }
    myViewModel.process('JSON data obtained');
    if (myViewModel.copyFreeBaseJSON()) {
        // Copy response 5000 times
        for (var p = 0; p < 5000; p++) {
            var result = json.result;
            var newObj = copyObject(result);
            newObj = newObj;
        }
        
        console.log(JSON.stringify(json));
    }

    myViewModel.process('JSON data copied 5000 times');
    myViewModel.jsonData(JSON.stringify(json));
    setTimeout(startFreeBaseTopic, 1000);
}

function copyObject(origin) {
    // If it's an array
    if (Object.prototype.toString.call( origin ) === '[object Array]') {
        var newArray = [];
        for (var i=0; i<origin.length; i++) {
            newArray[i] = copyObject(origin[i]);
        }
        return newArray;

    // If it's a JSON object
    } else if (typeof origin == 'object') {
        var newObj = {};
        var keys = Object.keys(origin);
        for (var key in origin) {
            newObj[key] = copyObject(origin[key]);
        }
        return newObj;

    // if normal value
    } else if (typeof origin == 'boolean' || typeof origin == 'number' || typeof origin == 'string') {
        return origin;
    }

    return 'error';
}

function startFreeBaseTopic(){
   if (!myViewModel.processInitialized()) {
        resetModel();
        return;
   }

   myViewModel.process('Requesting Game Of Thrones details...');
   var freebaseV = myViewModel.wantSandbox()? 'v1sandbox' : 'v1';
   $.ajax({
        url: 'https://www.googleapis.com/freebase/'+freebaseV+'/topic/en/'+searchTopic+'?filter=/common/topic/image&limit=1',
        type: "GET",
        dataType: "jsonp",
        async:false,
        success: function (msg) {freeBaseTopicCallback(msg);},
        error: function () {freeBaseError();}
    });
}

function freeBaseTopicCallback(json) {
    if (!myViewModel.processInitialized()) {
        resetModel();
        return;
    }

    if (json.property &&  json.property['/common/topic/image'] && json.property['/common/topic/image'].values && json.property['/common/topic/image'].values[0]) {
        freeBaseImg = json.property['/common/topic/image'].values[0].id;
    }
    
    console.log(JSON.stringify(json));

    myViewModel.process('JSON Details obtained!');

    if (freeBaseImg.length > 0)
        setTimeout(startFreeBaseTopicImage, 1000);
    else
        setTimeout(resetAndScheduleBackgroundProcess, 3000);
}

function startFreeBaseTopicImage() {
    if (!myViewModel.processInitialized()) {
        resetModel();
        return;
    }

   console.log(freeBaseImg);
   myViewModel.process('Requesting Game Of Throne image...');
   myViewModel.imgVisible(true);
   var freebaseV = myViewModel.wantSandbox()? 'v1sandbox' : 'v1';
   myViewModel.imgPath('https://usercontent.googleapis.com/freebase/'+freebaseV+'/image'+freeBaseImg);
}

function imgLoadFinished() {
    var img = document.getElementById('fbImg');
    myViewModel.process('Image obtained!');
    console.log("Dimensions " + img.height + "x" + img.width + ", Type: " + img.src.split('.').pop());
    setTimeout(processHeavyCalculation(), 1000);
}

function processHeavyCalculation() {
    if (myViewModel.longProcess()) {
        myViewModel.process('Heavy process started: 2000 console.log');
        setTimeout(function() {
            var a = '';
            for (var i=1; i<2000; i++) {
               a = a + ' - ' + i;
               console.log(a);
            }

            myViewModel.process('completed! restart process in 3"');
            setTimeout(resetAndScheduleBackgroundProcess, 3000);
        }, 10);
    } else {
        myViewModel.process('completed! restart process in 3"');
        setTimeout(resetAndScheduleBackgroundProcess, 3000);
    }
}

function freeBaseError(xhr, status, exception) {
    stopBackgroundProcess();
    alert("Error: " + JSON.stringify(xhr) + ' - ' + xhr.responseText + ' - ' + status+" - "+exception);
}