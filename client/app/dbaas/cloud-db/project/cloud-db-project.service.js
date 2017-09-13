class CloudDbProjectService {
    constructor ($q, /*CloudDb,*/ ServiceHelper, SidebarMenu) {
        this.$q = $q;
        //this.CloudDb = CloudDb;
        this.ServiceHelper = ServiceHelper;
        this.SidebarMenu = SidebarMenu;
    }

    getInstances (projectId) {
        return this.ServiceHelper.errorHandler("cloud_db_project_instance_loading_error")({});
    }

    rebootInstance (projectId, instanceId) {
        return this.ServiceHelper.errorHandler("cloud_db_project_instance_reboot_error")({});
    }

    deleteInstance (projectId, instanceId) {
        return this.ServiceHelper.errorHandler("cloud_db_project_instance_delete_error")({});
    }

    getConfiguration (projectId) {
        return this.ServiceHelper.errorHandler("cloud_db_project_configuration_loading_error")({});
        /* return this.CloudDb.Lexi().get({ projectId })
            .$promise
            .then(response => {
                response.displayName = response.name || projectId;
                return response;
            })
            .catch(this.ServiceHelper.errorHandler("cloud_db_home_configuration_loading_error"));*/
    }

    getSubscription (projectId) {
        return this.ServiceHelper.errorHandler("cloud_db_project_subscription_loading_error")({});
        /* return this.CloudDb.Lexi().getServiceInfos({ projectId })
            .$promise
            .catch(this.ServiceHelper.errorHandler("cloud_db_home_subscription_loading_error"));*/
    }

    updateName (projectId, newName) {
        return this.ServiceHelper.errorHandler("cloud_db_project_change_error")({});
        /* return this.CloudDb.Lexi().edit({ projectId }, { name: newName })
            .$promise
            .then(response => {
                this.getConfiguration(projectId).then(configuration => this.changeMenuTitle(projectId, configuration.displayName || projectId));
                return response;
            })
            .catch(this.ServiceHelper.errorHandler("cloud_db_name_change_error"));*/
    }
}

angular.module("managerApp").service("CloudDbProjectService", CloudDbProjectService);
