class CloudDbProjectService {
    constructor ($q, CloudDbInstanceService, OvhApiCloudDb, ServiceHelper, SidebarMenu) {
        this.$q = $q;
        this.CloudDbInstanceService = CloudDbInstanceService;
        this.OvhApiCloudDb = OvhApiCloudDb;
        this.ServiceHelper = ServiceHelper;
        this.SidebarMenu = SidebarMenu;
    }

    getInstances (projectId) {
        return this.OvhApiCloudDb.StandardInstance().Lexi().query({ projectId })
            .$promise
            .then(response => {
                const promises = _.map(response, instanceId => this.CloudDbInstanceService.getInstance(projectId, instanceId));
                return this.$q.all(promises);
            })
            .catch(this.ServiceHelper.errorHandler("cloud_db_project_instance_loading_error"));
    }

    rebootInstance (projectId, instanceId) {
        return this.ServiceHelper.errorHandler("cloud_db_project_instance_reboot_error")({});
    }

    deleteInstance (projectId, instanceId) {
        return this.ServiceHelper.errorHandler("cloud_db_project_instance_delete_error")({});
    }

    getConfiguration (projectId) {
        return this.OvhApiCloudDb.Lexi().get({ projectId })
            .$promise
            .then(response => {
                response.displayName = response.name || projectId;
                return response;
            })
            .catch(this.ServiceHelper.errorHandler("cloud_db_project_configuration_loading_error"));
    }

    getSubscription (projectId) {
        return this.OvhApiCloudDb.Lexi().getServiceInfos({ projectId })
            .$promise
            .catch(this.ServiceHelper.errorHandler("cloud_db_project_subscription_loading_error"));
    }

    updateName (projectId, newName) {
        return this.OvhApiCloudDb.Lexi().edit({ projectId }, { name: newName })
            .$promise
            .then(response => {
                this.getConfiguration(projectId).then(configuration => this.changeMenuTitle(projectId, configuration.displayName || projectId));
                return response;
            })
            .catch(this.ServiceHelper.errorHandler("cloud_db_project_change_error"));
    }
}

angular.module("managerApp").service("CloudDbProjectService", CloudDbProjectService);
