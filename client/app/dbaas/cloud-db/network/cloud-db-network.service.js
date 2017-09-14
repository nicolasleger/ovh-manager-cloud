class CloudDbNetworkService {
    constructor ($q, OvhApiCloudDb, ServiceHelper) {
        this.$q = $q;
        this.OvhApiCloudDb = OvhApiCloudDb;
        this.ServiceHelper = ServiceHelper;
    }

    addNetwork (projectId, instanceId, data) {
        return this.OvhApiCloudDb.StandardInstance().WhiteList().Lexi().post({ projectId, instanceId }, data)
            .$promise
            .then(this.ServiceHelper.successHandler("cloud_db_network_add_success"))
            .catch(this.ServiceHelper.errorHandler("cloud_db_network_add_error"));
    }

    saveNetwork (projectId, instanceId, networkId, data) {
        return this.OvhApiCloudDb.StandardInstance().WhiteList().Lexi().edit({ projectId, instanceId, networkId }, data)
            .$promise
            .then(this.ServiceHelper.successHandler("cloud_db_network_update_success"))
            .catch(this.ServiceHelper.errorHandler("cloud_db_network_update_error"));
    }

    deleteNetwork (projectId, instanceId, networkId) {
        return this.OvhApiCloudDb.StandardInstance().WhiteList().Lexi().remove({ projectId, instanceId, networkId })
            .$promise
            .then(this.ServiceHelper.successHandler("cloud_db_network_delete_success"))
            .catch(this.ServiceHelper.errorHandler("cloud_db_network_delete_error"));
    }

    getNetwork (projectId, instanceId, networkId) {
        return this.OvhApiCloudDb.StandardInstance().WhiteList().Lexi().get({ projectId, instanceId, networkId })
            .$promise
            .catch(this.ServiceHelper.errorHandler("cloud_db_network_loading_error"));
    }

    getNetworks (projectId, instanceId) {
        return this.OvhApiCloudDb.StandardInstance().WhiteList().Lexi().query({ projectId, instanceId })
            .$promise
            .then(response => {
                const promises = _.map(response, networkId => this.OvhApiCloudDb.StandardInstance().WhiteList().Lexi().get({ projectId, instanceId, networkId }).$promise);
                return this.$q.all(promises);
            })
            .catch(this.ServiceHelper.errorHandler("cloud_db_network_list_loading_error"));
    }
}

angular.module("managerApp").service("CloudDbNetworkService", CloudDbNetworkService);
