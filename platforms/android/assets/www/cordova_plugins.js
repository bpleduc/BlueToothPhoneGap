cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.randdusing.bluetoothle/www/bluetoothle.js",
        "id": "com.randdusing.bluetoothle.BluetoothLe",
        "clobbers": [
            "window.bluetoothle"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.randdusing.bluetoothle": "1.0.2"
}
// BOTTOM OF METADATA
});