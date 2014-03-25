Ext.define('SenchaTest.model.Device', {
    extend: 'Ext.data.Model',
    config: {
        fields: ['name', 'address'],
        proxy: {
            type: 'rest',
            reader: {
                type: 'json'
            }
        }
    }
});

// Uses the User Model's Proxy
Ext.create('Ext.data.Store', {
    model: 'Device'
});