class CloudDbNetworkService {
    constructor (ServiceHelper) {
        this.ServiceHelper = ServiceHelper;
    }

    addNetwork (projectId, instanceId, data) {
        return this.ServiceHelper.errorHandler("cloud_db_network_add_error")({});
    }

    saveNetwork (projectId, instanceId, networkId, data) {
        return this.ServiceHelper.errorHandler("cloud_db_network_update_error")({});
    }

    deleteNetwork (projectId, instanceId, networkId) {
        return this.ServiceHelper.errorHandler("cloud_db_network_delete_error")({});
    }

    getNetwork (projectId, instanceId, networkId) {
        return this.ServiceHelper.errorHandler("cloud_db_network_loading_error")({});
    }

    getNetworks (projectId, instanceId) {
        return this.ServiceHelper.errorHandler("cloud_db_network_list_loading_error")({});
    }
}

angular.module("managerApp").service("CloudDbNetworkService", CloudDbNetworkService);
