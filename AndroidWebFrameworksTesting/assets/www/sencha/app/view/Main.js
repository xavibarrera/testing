Ext.define('SenchaTest.view.Main', {
	  extend: 'Ext.Component',
	  config: {
		itemId: 'mainView',
		tpl: '<strong>Sencha test created by {name} {age}</strong>',
		items: [
	        {
	         xtype: 'toolbar',
	         docked: 'top',
	         title: 'Top Toolbar'
	        }
       ]
	  },
	  initialize: function() {
	     this.callParent(arguments);
	  }
});
