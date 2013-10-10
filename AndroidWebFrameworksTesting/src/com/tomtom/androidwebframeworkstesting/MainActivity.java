package com.tomtom.androidwebframeworkstesting;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesClient;
import com.google.android.gms.common.GooglePlayServicesUtil;
import com.google.android.gms.location.LocationClient;
import com.google.android.gms.location.LocationListener;
import com.tomtom.androidwebframeworkstesting.location.MyLocationListener;

import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Dialog;
import android.content.Intent;
import android.content.IntentSender;
import android.support.v4.app.DialogFragment;
import android.support.v4.app.FragmentActivity;
import android.util.Log;
import android.view.Menu;
import android.view.Window;
import android.webkit.ConsoleMessage;
import android.webkit.JavascriptInterface;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

public class MainActivity extends FragmentActivity implements GooglePlayServicesClient.ConnectionCallbacks, 
															  GooglePlayServicesClient.OnConnectionFailedListener {

	private final static String LOG_TAG = "MT";
	
	public  final static String APPTAG 									= "WebFramework";
	public  final static int 	MSG_ID_UPDATE_LOCATION_MSG_ID 			= 1000;
	public  final static String	BUNDLE_KEY_UPDATE_LOCATION 				= "ul";
	private final static int 	CONNECTION_FAILURE_RESOLUTION_REQUEST 	= 9000;

	private WebView 			webView 			= null;
	private LocationClient 		mLocationClient 	= null;
	private MyLocationListener 	mLocationListener 	= null;
	private ConnectionResult 	connectionResult 	= null;
	
	Handler locationHandler = new Handler() {
        public void handleMessage(Message msg) {
            switch (msg.what) {
            case MSG_ID_UPDATE_LOCATION_MSG_ID:
            	String jsonLocation = msg.getData().getString(BUNDLE_KEY_UPDATE_LOCATION);
                if (webView != null)
                	webView.loadUrl("javascript:updateLocation('"+jsonLocation+"')");
                break;
            }
            super.handleMessage(msg);
        }
    };

	@SuppressLint("SetJavaScriptEnabled")
	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		
		//Remove title bar
		this.requestWindowFeature(Window.FEATURE_NO_TITLE);
		
		setContentView(R.layout.activity_main);
		webView = (WebView) findViewById(R.id.webview);
		
		// Load HTML
		webView.loadUrl("file:///android_asset/www/index.html");
		
		// Enable Javascript
		WebSettings webSettings = webView.getSettings();
		webSettings.setJavaScriptEnabled(true);
		
		// Enable Javascript communication
		webView.addJavascriptInterface(this, "Android");
		
		// Set scroll properties
		webView.setVerticalScrollBarEnabled(true);
		webView.setHorizontalScrollBarEnabled(false);
		webView.setScrollBarStyle(WebView.SCROLLBARS_OUTSIDE_OVERLAY);
		
		// Error control
		webView.setWebViewClient(webViewClient);
		webView.setWebChromeClient(webChromeClient);
		
		mLocationListener = new MyLocationListener(locationHandler);
		mLocationClient = new LocationClient(this, this, this);
	}

	@Override
	protected void onStart() {
		mLocationListener.initialize();
		mLocationClient.connect();
		
		super.onStart();
	}
	
	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		// Inflate the menu; this adds items to the action bar if it is present.
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

	
	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		switch (requestCode) {
	        case CONNECTION_FAILURE_RESOLUTION_REQUEST :

	            switch (resultCode) {
	                case Activity.RESULT_OK :
	
	                break;
	            }
	    }
		super.onActivityResult(requestCode, resultCode, data);
	}
	
	@JavascriptInterface
	public void startLocationUpdates() {
		if (servicesConnected())
			mLocationClient.requestLocationUpdates(mLocationListener.getLocationRequest(), mLocationListener);
	}
	
	@JavascriptInterface
	public void stopLocationUpdates() {
		if (servicesConnected())
			mLocationClient.removeLocationUpdates(mLocationListener);
	}
	
	@JavascriptInterface
	public String getJSONPersons() {
		String jsonPersons = "[{\"name\":\"Xavi\",\"age\":\"30\"}," +
				"{\"name\":\"Pedro\",\"age\":\"31\"}," +
				"{\"name\":\"Iniesta\",\"age\":\"32\"}," +
				"{\"name\":\"Pujol\",\"age\":\"33\"}," +
				"{\"name\":\"Mascherano\",\"age\":\"34\"}," +
				"{\"name\":\"Neymar\",\"age\":\"35\"}," +
				"{\"name\":\"Messi\",\"age\":\"36\"}," +
				"{\"name\":\"Valdes\",\"age\":\"37\"}," +
				"{\"name\":\"Pique\",\"age\":\"38\"}," +
				"{\"name\":\"Iniesta\",\"age\":\"32\"}," +
				"{\"name\":\"Pujol\",\"age\":\"33\"}," +
				"{\"name\":\"Mascherano\",\"age\":\"34\"}," +
				"{\"name\":\"Neymar\",\"age\":\"35\"}," +
				"{\"name\":\"Messi\",\"age\":\"36\"}," +
				"{\"name\":\"Valdes\",\"age\":\"37\"}," +
				"{\"name\":\"Pique\",\"age\":\"38\"}," +
				"{\"name\":\"Iniesta\",\"age\":\"32\"}," +
				"{\"name\":\"Pujol\",\"age\":\"33\"}," +
				"{\"name\":\"Mascherano\",\"age\":\"34\"}," +
				"{\"name\":\"Neymar\",\"age\":\"35\"}," +
				"{\"name\":\"Messi\",\"age\":\"36\"}," +
				"{\"name\":\"Valdes\",\"age\":\"37\"}," +
				"{\"name\":\"Pique\",\"age\":\"38\"}," +
				"{\"name\":\"Pinto\",\"age\":\"39\"}]";
		Log.d(LOG_TAG, jsonPersons);
		return jsonPersons;
	}
	
    /** Show a toast from the web page */
    @JavascriptInterface
    public void showToast(String toast) {
    	Log.d(LOG_TAG, "showToast");
        Toast.makeText(getApplicationContext(), toast, Toast.LENGTH_SHORT).show();
    }
	
    
	// ***************************************************************************
	// 					WEB errors control
	// ***************************************************************************
    
    private final WebChromeClient webChromeClient = new WebChromeClient() {
		@Override
		public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
			return super.onJsAlert(view, url, message, result);
		}
		
		@Override
		public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
			if(consoleMessage==null || consoleMessage.sourceId()==null)
				return false;

			String file = consoleMessage.sourceId().substring(consoleMessage.sourceId().lastIndexOf("/")+1);
			String message = "Error in "+file+".\n"+consoleMessage.message()+".\n Line:"+consoleMessage.lineNumber();
			Log.e(LOG_TAG, message); 
			
			showToast(message);

			return true;
		};			
	};	
	
	private final WebViewClient webViewClient = new WebViewClient() {
		
		@Override
		public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
			Log.e(LOG_TAG, "Error loading page: "+failingUrl);
		};
		
		@Override
		public void onPageFinished(WebView view, String url) {
			super.onPageFinished(view, url);
		}
		
	    @Override
	    public boolean shouldOverrideUrlLoading(WebView view, String url) {
	    	super.shouldOverrideUrlLoading(view, url);
	    	Uri uri = Uri.parse(url);
	    	if("http".equals(uri.getScheme()) || "https".equals(uri.getScheme())) {
	    		Intent intent = new Intent(Intent.ACTION_VIEW, uri);
	    		startActivity(intent);
	    	} else {
	    		view.loadUrl(url);
	    	}
	        return true;
	    }
	};

	
	// ***************************************************************************
	// 					Google Play Services
	// ***************************************************************************
    
    private boolean servicesConnected() {
        // Check that Google Play services is available
        int resultCode = GooglePlayServicesUtil.isGooglePlayServicesAvailable(this);
        
        // If Google Play services is available
        if (ConnectionResult.SUCCESS == resultCode) {
            Log.d("Location Updates", "Google Play services is available.");
            return true;
        
        // Google Play services was not available for some reason
        }  else {
            // Display an error dialog
            Dialog dialog = GooglePlayServicesUtil.getErrorDialog(resultCode, this, 0);
            if (dialog != null) {
                ErrorDialogFragment errorFragment = new ErrorDialogFragment();
                errorFragment.setDialog(dialog);
                errorFragment.show(getSupportFragmentManager(), APPTAG);
            }
            return false;
        }
    }
    
    public static class ErrorDialogFragment extends DialogFragment {
        private Dialog mDialog;
        // Default constructor. Sets the dialog field to null
        public ErrorDialogFragment() {
            super();
            mDialog = null;
        }
        // Set the dialog to display
        public void setDialog(Dialog dialog) {
            mDialog = dialog;
        }
        // Return a Dialog to the DialogFragment.
        @Override
        public Dialog onCreateDialog(Bundle savedInstanceState) {
            return mDialog;
        }
    }
    
	@Override
	public void onConnectionFailed(ConnectionResult arg0) {
		/*
         * Google Play services can resolve some errors it detects.
         * If the error has a resolution, try sending an Intent to
         * start a Google Play services activity that can resolve
         * error.
         */
        if (connectionResult.hasResolution()) {
            try {
                // Start an Activity that tries to resolve the error
                connectionResult.startResolutionForResult(
                        this,
                        CONNECTION_FAILURE_RESOLUTION_REQUEST);
                /*
                * Thrown if Google Play services canceled the original
                * PendingIntent
                */
            } catch (IntentSender.SendIntentException e) {
                e.printStackTrace();
            }
        } else {
            /*
             * If no resolution is available, display a dialog to the
             * user with the error.
             */
            showErrorDialog(connectionResult.getErrorCode());
        }
	}

    /**
     * Show a dialog returned by Google Play services for the
     * connection error code
     *
     * @param errorCode An error code returned from onConnectionFailed
     */
    private void showErrorDialog(int errorCode) {

        // Get the error dialog from Google Play services
        Dialog errorDialog = GooglePlayServicesUtil.getErrorDialog(
            errorCode,
            this,
            CONNECTION_FAILURE_RESOLUTION_REQUEST);

        // If Google Play services can provide an error dialog
        if (errorDialog != null) {

            // Create a new DialogFragment in which to show the error dialog
            ErrorDialogFragment errorFragment = new ErrorDialogFragment();

            // Set the dialog in the DialogFragment
            errorFragment.setDialog(errorDialog);

            // Show the error dialog in the DialogFragment
            errorFragment.show(getSupportFragmentManager(), APPTAG);
        }
    }
	
	@Override
	public void onConnected(Bundle arg0) {}

	@Override
	public void onDisconnected() {}
}

