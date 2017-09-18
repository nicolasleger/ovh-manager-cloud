class CloudDbUserService {
    constructor ($q, OvhApiCloudDbStdInstanceUser, ServiceHelper) {
        this.$q = $q;
        this.OvhApiCloudDbStdInstanceUser = OvhApiCloudDbStdInstanceUser;
        this.ServiceHelper = ServiceHelper;
    }

    addUser (projectId, instanceId, data) {
        return this.ServiceHelper.errorHandler("cloud_db_user_add_error")({});
    }

    saveUser (projectId, instanceId, userId, data) {
        return this.ServiceHelper.errorHandler("cloud_db_user_update_error")({});
    }

    deleteUser (projectId, instanceId, userId) {
        return this.OvhApiCloudDbStdInstanceUser.Lexi().delete({ projectId, instanceId, userId })
            .$promise
            .then(this.ServiceHelper.errorHandler("cloud_db_user_delete_success"))
            .catch(this.ServiceHelper.errorHandler("cloud_db_user_delete_error"));
    }

    getUser (projectId, instanceId, userId) {
        return this.OvhApiCloudDbStdInstanceUser.Lexi().get({ projectId, instanceId, userId })
            .$promise
            .then(response => {
                response.displayName = response.name;
                _.forEach(response.databases, database => {
                    database.grantType = {
                        value: database.grantType,
                        text: database.grantType
                    };
                });
                return response;
            })
            .catch(this.ServiceHelper.errorHandler("cloud_db_user_loading_error"));
    }

    getUsers (projectId, instanceId) {
        return this.OvhApiCloudDbStdInstanceUser.Lexi().query({ projectId, instanceId })
            .$promise
            .then(response => {
                const promises = _.map(response, userId => this.getUser(projectId, instanceId, userId));
                return this.$q.all(promises);
            })
            .catch(this.ServiceHelper.errorHandler("cloud_db_user_list_loading_error"));
    }
}

angular.module("managerApp").service("CloudDbUserService", CloudDbUserService);
