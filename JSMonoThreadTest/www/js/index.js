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
    self.historyText        = ko.observable('');
    self.jsonData           = ko.observable('');
    self.jsonDataRsp1       = ko.observable('');
    self.jsonDataRsp2       = ko.observable('');
    self.imgPath            = ko.observable('');
    self.imgVisible         = ko.observable(false);
    self.processInitialized = ko.observable(false);
    self.wantSandbox        = ko.observable(true);
    self.copyFreeBaseJSON   = ko.observable(true);
    self.timeoutTrick       = ko.observable(false);
    self.processPanelHeight = ko.computed(function() {
        var historyHeight = this.historyText().length > 0 ? 60 : 0;
        var photoHeight = 0;//this.processInitialized()? 92 : 0;
        return 50 + historyHeight + photoHeight + 'px';
    }, this);
}
var myViewModel = new ViewModel();

$("#screen1").on( "pagecreate", function( event ) {
    ko.applyBindings(myViewModel);
    $('#sandbox').attr('checked',myViewModel.wantSandbox()).checkboxradio('refresh');
    $('#jsonCalc').attr('checked',myViewModel.copyFreeBaseJSON()).checkboxradio('refresh');
    $('#timeoutTrick').attr('checked',myViewModel.timeoutTrick()).checkboxradio('refresh');

    //FastClick.attach(document.body);
} );

var searchTopic = 'game_of_thrones'
var freeBaseImg = '';

function addTextToHistory(text) {
    var historyText = myViewModel.historyText();
    historyText = '[' + displayTime() + '] ' + text + '\n' + historyText;
    myViewModel.historyText(historyText);
}

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

    freeBaseImg = '';
    setTimeout(startFreeBaseSearch, 10); 
}

function startFreeBaseSearch(){
    resetModel();
    if (!myViewModel.processInitialized()) {
        return;
    }
    addTextToHistory('Start search for GOT');
    myViewModel.process('search for Game Of Thrones started...');
    var freebaseV = myViewModel.wantSandbox()? 'v1sandbox' : 'v1';
    $.ajax({
        url: 'https://www.googleapis.com/freebase/'+freebaseV+'/search?query='+searchTopic+'&output=(description)',
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
    addTextToHistory('Receive JSON of ' + getBytesNumber(json));
    console.log(JSON.stringify(json));
    myViewModel.jsonDataRsp1(JSON.stringify(json));

    setTimeout(function() {
        copyJSON5000Times(json);
    }, 10);
}

function copyJSON5000Times(json) {
    if (myViewModel.copyFreeBaseJSON()) {
        if (myViewModel.timeoutTrick()) {
            processJSON(0, json);
        } else {
            // Copy response 5000 times
            for (var p = 0; p < 5000; p++) {
                var result = json.result;
                var newObj = copyObject(result);
                newObj = newObj;
            }

            addTextToHistory('JSON data copied 5000 times. Restart in 1"');
            myViewModel.process('JSON data copied 5000 times. Restart in 1"');
            setTimeout(resetAndScheduleBackgroundProcess, 1000);
        } 
    } else {
        addTextToHistory('Restart in 1"');
        myViewModel.process('Restart in 1"');
        setTimeout(resetAndScheduleBackgroundProcess, 1000);
    }
}

function processJSON(times, json) {
    if (times < 5000) {
        times++;
        var result = json.result;
        var newObj = copyObject(result);
        newObj = newObj;
        setTimeout(function() {
            processJSON(times, json);
        }, 0);
    } else {
        addTextToHistory('JSON copied 5000 times (with timeout). Restart in 1"');
        myViewModel.process('JSON copied 5000 times (with timeout). Restart in 1"');
        setTimeout(resetAndScheduleBackgroundProcess, 1000);
    }
}

function freeBaseError(xhr, status, exception) {
    stopBackgroundProcess();
    alert("Error: " + JSON.stringify(xhr) + ' - ' + xhr.responseText + ' - ' + status+" - "+exception);
}

/*
function startFreeBaseTopic(){
   if (!myViewModel.processInitialized()) {
        resetModel();
        return;
   }

   myViewModel.process('Requesting Game Of Thrones details...');
   addTextToHistory('Request GOT details');
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
    
    addTextToHistory('Receive JSON of ' + getBytesNumber(json));
    myViewModel.process('JSON Details obtained!');
    myViewModel.jsonDataRsp2(JSON.stringify(json));
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
   addTextToHistory('Request image');
   myViewModel.imgVisible(true);
   var freebaseV = myViewModel.wantSandbox()? 'v1sandbox' : 'v1';
   myViewModel.imgPath('https://usercontent.googleapis.com/freebase/'+freebaseV+'/image'+freeBaseImg);
}

function imgLoadFinished() {
    var img = document.getElementById('fbImg');
    myViewModel.process('Image obtained!');
    addTextToHistory('Image obtained');
    console.log("Dimensions " + img.height + "x" + img.width + ", Type: " + img.src.split('.').pop());
    setTimeout(processHeavyCalculation(), 1000);
}

function processHeavyCalculation() {
    if (myViewModel.longProcess()) {
        addTextToHistory('Start heavy JS process: 2000 console.log');
        myViewModel.process('Heavy process started: 2000 console.log');
        setTimeout(function() {
            var a = '';
            for (var i=1; i<2000; i++) {
               a = a + ' - ' + i;
               console.log(a);
            }

            myViewModel.process('completed! restart process in 1"');
            addTextToHistory('end of heavy JS process');
            setTimeout(resetAndScheduleBackgroundProcess, 1000);
        }, 10);
    } else {
        myViewModel.process('completed! restart process in 1"');
        setTimeout(resetAndScheduleBackgroundProcess, 1000);
    }
}
*/