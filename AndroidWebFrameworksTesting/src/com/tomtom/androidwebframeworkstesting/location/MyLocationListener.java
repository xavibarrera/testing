package com.tomtom.androidwebframeworkstesting.location;

import com.google.android.gms.location.LocationListener;
import com.google.android.gms.location.LocationRequest;
import com.tomtom.androidwebframeworkstesting.MainActivity;

import android.location.Location;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.text.format.DateFormat;
import android.util.Log;

public class MyLocationListener implements LocationListener {
	
	private final static int UPDATE_INTERVAL_IN_MILLISECONDS	 	= 5000; // 5 seconds
	private final static int FAST_INTERVAL_CEILING_IN_MILLISECONDS 	= 5000; // 1 second
	
	private LocationRequest mLocationRequest;
	private Handler 		locationHandler;
	
	public MyLocationListener(Handler locationHandler) {
		this.locationHandler = locationHandler;
	}

	public void initialize() {
		// Create a new global location parameters object
        mLocationRequest = LocationRequest.create();

        mLocationRequest.setInterval(UPDATE_INTERVAL_IN_MILLISECONDS);
        mLocationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
        mLocationRequest.setFastestInterval(FAST_INTERVAL_CEILING_IN_MILLISECONDS);
	}
	
	public LocationRequest getLocationRequest() {
		return mLocationRequest;
	}
	
	@Override
	public void onLocationChanged(Location location) {
		Log.d(MainActivity.APPTAG, location.toString());
		
		Message message = new Message();
        message.what = MainActivity.MSG_ID_UPDATE_LOCATION_MSG_ID;
        Bundle data = new Bundle();
        
        double lat = location.getLatitude();
        double lng = location.getLongitude();
        float  acc = location.getAccuracy();
        CharSequence date = DateFormat.format("HH:mm", location.getTime());
        StringBuffer jsonLocation = new StringBuffer();
        jsonLocation.append('{');
        jsonLocation.append("\"lat\":\"").append(lat).append("\",\"lng\":\"").append(lng).append("\",");
        jsonLocation.append("\"date\":\"").append(date).append("\",\"acc\":\"").append(acc).append("\"");
        jsonLocation.append('}');
        
        data.putString(MainActivity.BUNDLE_KEY_UPDATE_LOCATION, jsonLocation.toString());
		message.setData(data);
        locationHandler.sendMessage(message);
	}
}
