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
// var app = {
    // // Application Constructor
    // initialize: function() {
        // this.bindEvents();
    // },
    // // Bind Event Listeners
    // //
    // // Bind any events that are required on startup. Common events are:
    // // 'load', 'deviceready', 'offline', and 'online'.
    // bindEvents: function() {
        // document.addEventListener('deviceready', this.onDeviceReady, false);
    // },
    // // deviceready Event Handler
    // //
    // // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // // function, we must explicitly call 'app.receivedEvent(...);'
    // onDeviceReady: function() {
        // app.receivedEvent('deviceready');
    // },
    // // Update DOM on a Received Event
    // receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');
// 
        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');
// 
        // console.log('Received Event: ' + id);
    // }
// };


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
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log("Starting");
        //bluetoothle.initialize(initializeSuccess, initializeError, true);
        StartBluetooth();
    }
};
/*
UART Service UUID: 6E400001-B5A3-F393-E0A9-E50E24DCCA9E
TX Characteristic UUID: 6E400002-B5A3-F393-E0A9-E50E24DCCA9E
RX Characteristic UUID: 6E400003-B5A3-F393-E0A9-E50E24DCCA9E
 */
// function initializeSuccess(obj) {
    // alert("Init Success");
    // var params = {"serviceUuids":["6E400001-B5A3-F393-E0A9-E50E24DCCA9E"]}; 
    // bluetoothle.startScan(startScanSuccessCallback, startScanErrorCallback, params);
// }
// 
// function initializeError(obj) {
    // alert("Init Failure");
// }
// 
// function startScanSuccessCallback(obj){
	// //ex obj
	// //{"status":"scanResult","address":"ED:41:73:E6:04:F5","rssi":-48,"name":"UART"}
  // if (obj.status == "scanResult") 
  // {
    // console.log("Stopping scan..");
    // bluetoothle.stopScan(stopScanSuccess, stopScanError);
    // clearScanTimeout();
// 
    // window.localStorage.setItem(addressKey, obj.address);
        // connectDevice(obj.address);
  // }
  // else if (obj.status == "scanStarted")
  // {
    // console.log("Scan was started successfully, stopping in 10");
    // scanTimer = setTimeout(scanTimeout, 10000);
  // }
  // else
  // {
    // console.log("Unexpected start scan status: " + obj.status);
  // }
// }
// function startScanErrorCallback(){
	// console.log('Scan Fail');
// }
// 
// function stopScanSuccessCallback(){
	// console.log('Scan Stop Success');
// }
// function stopScanErrorCallback(){
	// console.log('Scan Stop Fail');
// }
// 
// 

/*
	pulled from: https://github.com/randdusing/BluetoothLE/tree/e927fa5ebae7b6db6c192f00291b0b16b58bc808

*/

var addressKey = "address";

var UARTServiceAssignedNumber = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
var UARTtxCharacteristicAssignedNumber = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
var UARTrxConfigDescriptorAssignedNumber = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";
var batteryServiceAssignedNumber = "180f";
var batteryLevelCharacteristicAssignedNumber = "2a19";

var scanTimer = null;
var connectTimer = null;
var reconnectTimer = null;

var iOSPlatform = "iOS";
var androidPlatform = "Android";


function StartBluetooth()
{

	for(var p in bluetoothle)
	{
	    console.log(p + ": " + bluetoothle[p]); //if you have installed Firebug.
	}

	console.log("starting bluetooth");
	bluetoothle.initialize(initializeSuccess, initializeError);
}

function initializeSuccess(obj)
{
  if (obj.status == "enabled")
  {
    var address = window.localStorage.getItem(addressKey);
    if (address == null)
    {
        console.log("Bluetooth initialized successfully, starting scan for heart rate devices.");
        var paramsObj = {"serviceAssignedNumbers":[UARTServiceAssignedNumber]};
        bluetoothle.startScan(startScanSuccess, startScanError, paramsObj);
    }
    else
    {
        connectDevice(address);
    }
  }
  else
  {
    console.log("Unexpected initialize status: " + obj.status);
  }
}

function initializeError(obj)
{
  console.log("Initialize error: " + obj.error + " - " + obj.message);
}

function startScanSuccess(obj)
{
  //ex obj
  //{"status":"scanResult","address":"ED:41:73:E6:04:F5","rssi":-48,"name":"UART"}
  if (obj.status == "scanResult")
  {
    console.log("Stopping scan..");
    bluetoothle.stopScan(stopScanSuccess, stopScanError);
    clearScanTimeout();

    window.localStorage.setItem(addressKey, obj.address);
        connectDevice(obj.address);
  }
  else if (obj.status == "scanStarted")
  {
    console.log("Scan was started successfully, stopping in 10");
    scanTimer = setTimeout(scanTimeout, 10000);
  }
  else
  {
    console.log("Unexpected start scan status: " + obj.status);
  }
}

function startScanError(obj)
{
  console.log("Start scan error: " + obj.error + " - " + obj.message);
}

function scanTimeout()
{
  console.log("Scanning time out, stopping");
  bluetoothle.stopScan(stopScanSuccess, stopScanError);
}

function clearScanTimeout()
{ 
    console.log("Clearing scanning timeout");
  if (scanTimer != null)
  {
    clearTimeout(scanTimer);
  }
}

function stopScanSuccess(obj)
{
  if (obj.status == "scanStopped")
  {
    console.log("Scan was stopped successfully");
  }
  else
  {
    console.log("Unexpected stop scan status: " + obj.status);
  }
}

function stopScanError(obj)
{
  console.log("Stop scan error: " + obj.error + " - " + obj.message);
}

function connectDevice(address)
{
  console.log("Begining connection to: " + address + " with 5 second timeout");
    var paramsObj = {"address":address};
  bluetoothle.connect(connectSuccess, connectError, paramsObj);
  connectTimer = setTimeout(connectTimeout, 5000);
}

function connectSuccess(obj)
{
  if (obj.status == "connected")
  {
    console.log("Connected to : " + obj.name + " - " + obj.address);

    //clearConnectTimeout();
    //tempDisconnectDevice();
    
    
//var UARTServiceAssignedNumber = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
//var UARTtxCharacteristicAssignedNumber = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
//RX Characteristic UUID: 6E400003-B5A3-F393-E0A9-E50E24DCCA9E
  bluetoothle.discover(discoverSuccessCallback, discoverFailCallback);
  
  
  }
  else if (obj.status == "connecting")
  {
    console.log("Connecting to : " + obj.name + " - " + obj.address);
  }
    else
  {
    console.log("Unexpected connect status: " + obj.status);
    clearConnectTimeout();
  }
}
///////
function discoverSuccessCallback(obj){
	console.log('Discover Success:'+JSON.stringify(obj));
	setTimeout(write,1000);
}
function discoverFailCallback(obj){
	console.log('Discover Fail'+JSON.stringify(obj));
}
function write(){	
		
	//var bytes = bluetoothle.getBytes("A");
	//var string = bluetoothle.getString("");
	
	//console.log('bytes:'+bytes);
	//console.log('string:'+string);
	//var u64 = "QQ==";	//A
	//var u64 = "Qg==";	//B
	var u64 = "Qw==";	//C
	
    var paramsObj = {
        "value": u64,
        "serviceUuid": UARTServiceAssignedNumber,
        "characteristicUuid": UARTtxCharacteristicAssignedNumber
    };
    //bluetoothle.write(writeClickwatchLEDSuccessCallback,writeClickwatchLEDErrorCallback, paramsObj);

	
	//var paramsObj = {"value":"QQ==","serviceUuid":"6E400001-B5A3-F393-E0A9-E50E24DCCA9E","characteristicUuid":"6E400002-B5A3-F393-E0A9-E50E24DCCA9E"};
    bluetoothle.write(writeSuccessCallback, writeErrorCallback, paramsObj);
}
function writeSuccessCallback(obj){
	console.log('Write Success'+obj);
}
function writeErrorCallback(obj){
	console.log(JSON.stringify(obj));
	console.log('Write Error'+obj);
}
////////
function connectError(obj)
{
  console.log("Connect error: " + obj.error + " - " + obj.message);
  clearConnectTimeout();
}

function connectTimeout()
{
  console.log("Connection timed out");
}

function clearConnectTimeout()
{ 
    console.log("Clearing connect timeout");
  if (connectTimer != null)
  {
    clearTimeout(connectTimer);
  }
}

function tempDisconnectDevice()
{
  console.log("Disconnecting from device to test reconnect");
    bluetoothle.disconnect(tempDisconnectSuccess, tempDisconnectError);
}

function tempDisconnectSuccess(obj)
{
    if (obj.status == "disconnected")
    {
        console.log("Temp disconnect device and reconnecting in 1 second. Instantly reconnecting can cause issues");
        setTimeout(reconnect, 1000);
    }
    else if (obj.status == "disconnecting")
    {
        console.log("Temp disconnecting device");
    }
    else
  {
    console.log("Unexpected temp disconnect status: " + obj.status);
  }
}

function tempDisconnectError(obj)
{
  console.log("Temp disconnect error: " + obj.error + " - " + obj.message);
}

function reconnect()
{
  console.log("Reconnecting with 5 second timeout");
  bluetoothle.reconnect(reconnectSuccess, reconnectError);
  reconnectTimer = setTimeout(reconnectTimeout, 5000);
}

function reconnectSuccess(obj)
{
  if (obj.status == "connected")
  {
    console.log("Reconnected to : " + obj.name + " - " + obj.address);

    clearReconnectTimeout();

    if (window.device.platform == iOSPlatform)
    {
      console.log("Discovering heart rate service");
      var paramsObj = {"serviceAssignedNumbers":[UARTServiceAssignedNumber]};
      bluetoothle.services(servicesHeartSuccess, servicesHeartError, paramsObj);
    }
    else if (window.device.platform == androidPlatform)
    {
      console.log("Beginning discovery");
      bluetoothle.discover(discoverSuccess, discoverError);
    }
  }
  else if (obj.status == "connecting")
  {
    console.log("Reconnecting to : " + obj.name + " - " + obj.address);
  }
  else
  {
    console.log("Unexpected reconnect status: " + obj.status);
    disconnectDevice();
  }
}

function reconnectError(obj)
{
  console.log("Reconnect error: " + obj.error + " - " + obj.message);
  disconnectDevice();
}

function reconnectTimeout()
{
  console.log("Reconnection timed out");
}

function clearReconnectTimeout()
{ 
    console.log("Clearing reconnect timeout");
  if (reconnectTimer != null)
  {
    clearTimeout(reconnectTimer);
  }
}

function servicesHeartSuccess(obj)
{
  if (obj.status == "discoveredServices")
  {
    var serviceAssignedNumbers = obj.serviceAssignedNumbers;
    for (var i = 0; i < serviceAssignedNumbers.length; i++)
    {
      var serviceAssignedNumber = serviceAssignedNumbers[i];

      if (serviceAssignedNumber == UARTServiceAssignedNumber)
      {
        console.log("Finding heart rate characteristics");
        var paramsObj = {"serviceAssignedNumber":UARTServiceAssignedNumber, "characteristicAssignedNumbers":[UARTtxCharacteristicAssignedNumber]};
        bluetoothle.characteristics(characteristicsHeartSuccess, characteristicsHeartError, paramsObj);
        return;
      }
    }
    console.log("Error: heart rate service not found");
  }
    else
  {
    console.log("Unexpected services heart status: " + obj.status);
  }
  disconnectDevice();
}

function servicesHeartError(obj)
{
  console.log("Services heart error: " + obj.error + " - " + obj.message);
  disconnectDevice();
}

function characteristicsHeartSuccess(obj)
{
  if (obj.status == "discoveredCharacteristics")
  {
    var characteristicAssignedNumbers = obj.characteristicAssignedNumbers;
    for (var i = 0; i < characteristicAssignedNumbers.length; i++)
    {
      console.log("Heart characteristics found, now discovering descriptor");
      var characteristicAssignedNumber = characteristicAssignedNumbers[i];

      if (characteristicAssignedNumber == UARTtxCharacteristicAssignedNumber)
      {
        var paramsObj = {"serviceAssignedNumber":UARTServiceAssignedNumber, "characteristicAssignedNumber":UARTtxCharacteristicAssignedNumber};
        bluetoothle.descriptors(descriptorsHeartSuccess, descriptorsHeartError, paramsObj);
        return;
      }
    }
    console.log("Error: Heart rate measurement characteristic not found.");
  }
    else
  {
    console.log("Unexpected characteristics heart status: " + obj.status);
  }
  disconnectDevice();
}

function characteristicsHeartError(obj)
{
  console.log("Characteristics heart error: " + obj.error + " - " + obj.message);
  disconnectDevice();
}

function descriptorsHeartSuccess(obj)
{
  if (obj.status == "discoveredDescriptors")
  {
    console.log("Discovered heart descriptors, now discovering battery service");
    var paramsObj = {"serviceAssignedNumbers":[batteryServiceAssignedNumber]};
    bluetoothle.services(servicesBatterySuccess, servicesBatteryError, paramsObj);
  }
    else
  {
    console.log("Unexpected descriptors heart status: " + obj.status);
    disconnectDevice();
  }
}

function descriptorsHeartError(obj)
{
  console.log("Descriptors heart error: " + obj.error + " - " + obj.message);
  disconnectDevice();
}

function servicesBatterySuccess(obj)
{
  if (obj.status == "discoveredServices")
  {
    var serviceAssignedNumbers = obj.serviceAssignedNumbers;
    for (var i = 0; i < serviceAssignedNumbers.length; i++)
    {
      var serviceAssignedNumber = serviceAssignedNumbers[i];

      if (serviceAssignedNumber == batteryServiceAssignedNumber)
      {
        console.log("Found battery service, now finding characteristic");
        var paramsObj = {"serviceAssignedNumber":batteryServiceAssignedNumber, "characteristicAssignedNumbers":[batteryLevelCharacteristicAssignedNumber]};
        bluetoothle.characteristics(characteristicsBatterySuccess, characteristicsBatteryError, paramsObj);
        return;
      }
    }
    console.log("Error: battery service not found");
  }
    else
  {
    console.log("Unexpected services battery status: " + obj.status);
  }
  disconnectDevice();
}

function servicesBatteryError(obj)
{
  console.log("Services battery error: " + obj.error + " - " + obj.message);
  disconnectDevice();
}

function characteristicsBatterySuccess(obj)
{
  if (obj.status == "discoveredCharacteristics")
  {
    var characteristicAssignedNumbers = obj.characteristicAssignedNumbers;
    for (var i = 0; i < characteristicAssignedNumbers.length; i++)
    {
      var characteristicAssignedNumber = characteristicAssignedNumbers[i];

      if (characteristicAssignedNumber == batteryLevelCharacteristicAssignedNumber)
      {
        readBatteryLevel();
        return;
      }
    }
    console.log("Error: Battery characteristic not found.");
  }
    else
  {
    console.log("Unexpected characteristics battery status: " + obj.status);
  }
  disconnectDevice();
}

function characteristicsBatteryError(obj)
{
  console.log("Characteristics battery error: " + obj.error + " - " + obj.message);
  disconnectDevice();
}

function discoverSuccess(obj)
{
    if (obj.status == "discovered")
    {
        console.log("Discovery completed");

    readBatteryLevel();
  }
  else
  {
    console.log("Unexpected discover status: " + obj.status);
    disconnectDevice();
  }
}

function discoverError(obj)
{
  console.log("Discover error: " + obj.error + " - " + obj.message);
  disconnectDevice();
}

function readBatteryLevel()
{
  console.log("Reading battery level");
  var paramsObj = {"serviceAssignedNumber":batteryServiceAssignedNumber, "characteristicAssignedNumber":batteryLevelCharacteristicAssignedNumber};
  bluetoothle.read(readSuccess, readError, paramsObj);
}

function readSuccess(obj)
{
    if (obj.status == "read")
    {
        var bytes = bluetoothle.getBytes(obj.value);
        console.log("Battery level: " + bytes[0]);

        console.log("Subscribing to heart rate for 5 seconds");
        var paramsObj = {"serviceAssignedNumber":UARTServiceAssignedNumber, "characteristicAssignedNumber":UARTtxCharacteristicAssignedNumber};
        bluetoothle.subscribe(subscribeSuccess, subscribeError, paramsObj);
        setTimeout(unsubscribeDevice, 5000);
    }
    else
  {
    console.log("Unexpected read status: " + obj.status);
    disconnectDevice();
  }
}

function readError(obj)
{
  console.log("Read error: " + obj.error + " - " + obj.message);
  disconnectDevice();
}

function subscribeSuccess(obj)
{   
    if (obj.status == "subscribedResult")
    {
        console.log("Subscription data received");

        //Parse array of int32 into uint8
        var bytes = bluetoothle.getBytes(obj.value);

        //Check for data
        if (bytes.length == 0)
        {
            console.log("Subscription result had zero length data");
            return;
        }

        //Get the first byte that contains flags
        var flag = bytes[0];

        //Check if u8 or u16 and get heart rate
        var hr;
        if ((flag & 0x01) == 1)
        {
            var u16bytes = bytes.buffer.slice(1, 3);
            var u16 = new Uint16Array(u16bytes)[0];
            hr = u16;
        }
        else
        {
            var u8bytes = bytes.buffer.slice(1, 2);
            var u8 = new Uint8Array(u8bytes)[0];
            hr = u8;
        }
        console.log("Heart Rate: " + hr);
    }
    else if (obj.status == "subscribed")
    {
        console.log("Subscription started");
    }
    else
  {
    console.log("Unexpected subscribe status: " + obj.status);
    disconnectDevice();
  }
}

function subscribeError(msg)
{
  console.log("Subscribe error: " + obj.error + " - " + obj.message);
  disconnectDevice();
}

function unsubscribeDevice()
{
  console.log("Unsubscribing heart service");
  var paramsObj = {"serviceAssignedNumber":UARTServiceAssignedNumber, "characteristicAssignedNumber":UARTtxCharacteristicAssignedNumber};
  bluetoothle.unsubscribe(unsubscribeSuccess, unsubscribeError, paramsObj);
}

function unsubscribeSuccess(obj)
{
    if (obj.status == "unsubscribed")
    {
        console.log("Unsubscribed device");

        console.log("Reading client configuration descriptor");
        var paramsObj = {"serviceAssignedNumber":UARTServiceAssignedNumber, "characteristicAssignedNumber":UARTtxCharacteristicAssignedNumber, "descriptorAssignedNumber":UARTrxConfigDescriptorAssignedNumber};
        bluetoothle.readDescriptor(readDescriptorSuccess, readDescriptorError, paramsObj);
    }
    else
  {
    console.log("Unexpected unsubscribe status: " + obj.status);
    disconnectDevice();
  }
}

function unsubscribeError(obj)
{
  console.log("Unsubscribe error: " + obj.error + " - " + obj.message);
  disconnectDevice();
}

function readDescriptorSuccess(obj)
{
    if (obj.status == "readDescriptor")
    {
        var bytes = bluetoothle.getBytes(obj.value);
        var u16Bytes = new Uint16Array(bytes.buffer);
        console.log("Read descriptor value: " + u16Bytes[0]);
        disconnectDevice();
    }
    else
  {
    console.log("Unexpected read descriptor status: " + obj.status);
    disconnectDevice();
  }
}

function readDescriptorError(obj)
{
  console.log("Read Descriptor error: " + obj.error + " - " + obj.message);
  disconnectDevice();
}

function disconnectDevice()
{
  bluetoothle.disconnect(disconnectSuccess, disconnectError);
}

function disconnectSuccess(obj)
{
    if (obj.status == "disconnected")
    {
        console.log("Disconnect device");
        closeDevice();
    }
    else if (obj.status == "disconnecting")
    {
        console.log("Disconnecting device");
    }
    else
  {
    console.log("Unexpected disconnect status: " + obj.status);
  }
}

function disconnectError(obj)
{
  console.log("Disconnect error: " + obj.error + " - " + obj.message);
}

function closeDevice()
{
  bluetoothle.close(closeSuccess, closeError);
}

function closeSuccess(obj)
{
    if (obj.status == "closed")
    {
        console.log("Closed device");
    }
    else
  {
    console.log("Unexpected close status: " + obj.status);
  }
}

function closeError(obj)
{
  console.log("Close error: " + obj.error + " - " + obj.message);
}
 
