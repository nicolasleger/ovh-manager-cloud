class CloudDbInstanceService {
    constructor ($filter, $translate, ControllerHelper, OvhApiCloudDb) {
        this.$filter = $filter;
        this.$translate = $translate;
        this.ControllerHelper = ControllerHelper;
        this.OvhApiCloudDb = OvhApiCloudDb;
    }

    getInstance (projectId, instanceId) {
        return this.OvhApiCloudDb.StandardInstance().Lexi().get({ projectId, instanceId })
            .$promise
            .then(response => {
                const totalText = this.$filter("bytes")(response.flavor.disk.value, 0, false, response.flavor.disk.unit);
                response.flavor.disk.text = totalText;

                const usedText = this.$filter("bytes")(response.diskUsed.value, 0, false, response.diskUsed.unit);
                response.diskUsed.text = usedText;

                response.diskUsage = {
                    used: response.diskUsed,
                    total: response.flavor.disk,
                    text: this.$translate.instant("cloud_db_project_instance_usage_text", { used: usedText, total: totalText })
                };

                response.flavor.ram.text = this.$filter("bytes")(response.flavor.ram.value, 0, false, response.flavor.ram.unit);

                return response;
            })
            .catch(error => console.log(error));
    }
}

angular.module("managerApp").service("CloudDbInstanceService", CloudDbInstanceService);
