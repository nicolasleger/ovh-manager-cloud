class CloudDbUserService {
    constructor (ServiceHelper) {
        this.ServiceHelper = ServiceHelper;
    }

    addUser (projectId, instanceId, data) {
        return this.ServiceHelper.errorHandler("cloud_db_user_add_error")({});
    }

    saveUser (projectId, instanceId, userId, data) {
        return this.ServiceHelper.errorHandler("cloud_db_user_update_error")({});
    }

    deleteUser (projectId, instanceId, userId) {
        return this.ServiceHelper.errorHandler("cloud_db_user_delete_error")({});
    }

    getUser (projectId, instanceId, userId) {
        return this.ServiceHelper.errorHandler("cloud_db_user_loading_error")({});
    }

    getUsers (projectId, instanceId) {
        return this.ServiceHelper.errorHandler("cloud_db_user_list_loading_error")({});
    }
}

angular.module("managerApp").service("CloudDbUserService", CloudDbUserService);
