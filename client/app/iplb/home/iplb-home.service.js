class IpLoadBalancerHomeService {
    constructor ($q, $translate, SidebarMenu, IpblServerStatusService, OvhApiIpLoadBalancing,
                 IpLoadBalancerCipherService, IpLoadBalancerFrontendsService,
                 IpLoadBalancerServerFarmService, RegionService, ServiceHelper) {
        this.$q = $q;
        this.$translate = $translate;
        this.SidebarMenu = SidebarMenu;
        this.IpblServerStatusService = IpblServerStatusService;
        this.IpLoadBalancing = OvhApiIpLoadBalancing;
        this.IpLoadBalancerCipherService = IpLoadBalancerCipherService;
        this.IpLoadBalancerFrontendsService = IpLoadBalancerFrontendsService;
        this.IpLoadBalancerServerFarmService = IpLoadBalancerServerFarmService;
        this.RegionService = RegionService;
        this.ServiceHelper = ServiceHelper;
    }

    getIPLBStatus (serviceName) {
        return this.IpLoadBalancing.Lexi().get({ serviceName })
            .$promise
            .then(iplbStatus => ({
                statusText: _.capitalize(iplbStatus.state),
                status: iplbStatus.state === "ok" ? "success" : "error"
            }))
            .catch(this.ServiceHelper.errorHandler("iplb_information_loading_error"));
    }

    getFrontendsStatus (serviceName) {
        return this.IpLoadBalancerFrontendsService.getFrontends(serviceName)
            .then(frontends => {
                const enabled = _.filter(frontends, { disabled: false }).length;
                return {
                    statusText: this.$translate.instant("iplb_status_active_total", {
                        activeCount: enabled,
                        totalCount: frontends.length
                    }),
                    status: frontends.length === enabled ? "success" : "warning"
                };
            })
            .catch(this.ServiceHelper.errorHandler("iplb_information_loading_error"));
    }

    getServerFarmsStatus (serviceName) {
        const serversStatus = {
            total: 0,
            ok: 0
        };

        return this.IpLoadBalancerServerFarmService.getServerFarms(serviceName)
            .then(serverFarms => this.$q.all(
                serverFarms.map(serverFarm => this.IpLoadBalancerServerFarmService
                    .getServerFarmServers(serviceName, serverFarm.farmId, serverFarm.type)
                    .then(servers => {
                        const activeServers = _.filter(servers, { status: "active" });
                        serversStatus.total += activeServers.length;
                        activeServers.forEach(server => {
                            const serverIcon = this.IpblServerStatusService.getStatusIcon(server);
                            // From a farm, a server considered "OK" if it is ok or has no check.
                            if (serverIcon === "success" || serverIcon === "help") {
                                serversStatus.ok++;
                            }
                        });

                        return {
                            // Farm considered in unknown state when no health check is set up
                            unknownState: _.chain(servers).map(server => this.IpblServerStatusService.hasNoInfo(server)).some(Boolean),
                            // Farm considered dysfunctional when one of the servers has bad health check
                            working: servers.length > 0 && serversStatus.ok === servers.length,
                            servers
                        };
                    })
                )
            ))
            .then(serverFarms => {
                const activeFarm = _.filter(serverFarms, { working: true }).length;
                const totalFarm = serverFarms.length;
                const workingServers = serversStatus.ok;
                const totalServers = serversStatus.total;

                let serversIcon;
                if (totalServers > 0) {
                    if (workingServers > 0) {
                        serversIcon = workingServers === totalServers ? "success" : "warning";
                    } else {
                        serversIcon = "error";
                    }
                } else {
                    serversIcon = "warning";
                }

                let farmIcon;
                if (totalFarm > 0) {
                    if (activeFarm > 0) {
                        farmIcon = totalFarm > 0 && activeFarm === totalFarm ? "success" : "warning";
                    } else {
                        farmIcon = "error";
                    }
                } else {
                    farmIcon = "warning";
                }

                return {
                    serverFarms: {
                        statusText: this.$translate.instant("iplb_status_working_farm_total", {
                            workingCount: activeFarm,
                            totalCount: totalFarm
                        }),
                        status: farmIcon
                    },
                    servers: {
                        statusText: [
                            this.$translate.instant("iplb_status_active", {
                                activeCount: totalServers
                            }),
                            this.$translate.instant("iplb_status_working_total", {
                                workingCount: workingServers,
                                totalCount: totalServers
                            })
                        ],
                        status: serversIcon
                    }
                };
            })
            .catch(this.ServiceHelper.errorHandler("iplb_information_loading_error"));
    }

    getInformations (serviceName) {
        return this.$q.all({
            configuration: this.IpLoadBalancing.Lexi().get({ serviceName }).$promise,
            failoverIp: this.IpLoadBalancing.Lexi().failoverIp({ serviceName }).$promise,
            natIp: this.IpLoadBalancing.Lexi().natIp({ serviceName }).$promise
        })
            .then(response => ({
                ipV4: response.configuration.ipLoadbalancing,
                ipV6: response.configuration.ipv6,
                failoverIp: response.failoverIp,
                natIp: response.natIp
            }))
            .catch(this.ServiceHelper.errorHandler("iplb_information_loading_error"));
    }

    getConfiguration (serviceName) {
        return this.IpLoadBalancing.Lexi().get({ serviceName })
            .$promise
            .then(response => {
                response.displayName = response.displayName || response.serviceName;
                response.sslConfiguration = this.IpLoadBalancerCipherService.transformCipher(response.sslConfiguration);
                return response;
            })
            .catch(this.ServiceHelper.errorHandler("iplb_configuration_loading_error"));
    }

    getUsage (serviceName) {
        return this.IpLoadBalancing.Quota().Lexi().query({ serviceName })
            .$promise
            .then(zones => this.$q.all(zones.map(zone => this.getUsageForZone(serviceName, zone))))
            .then(quotas => quotas.map(quota => {
                quota.region = this.RegionService.getRegion(quota.zone);
                return quota;
            }))
            .catch(this.ServiceHelper.errorHandler("iplb_usage_loading_error"));
    }

    getUsageForZone (serviceName, zoneName) {
        return this.IpLoadBalancing.Quota().Lexi().get({
            serviceName,
            zoneName
        }).$promise;
    }

    updateQuota (serviceName, zoneName, alert) {
        return this.IpLoadBalancing.Quota().Lexi().put({
            serviceName,
            zoneName
        }, {
            alert
        }).$promise
            .catch(this.ServiceHelper.errorHandler("iplb_utilisation_update_alert_error"));
    }

    updateName (serviceName, newName) {
        return this.IpLoadBalancing.Lexi().put({ serviceName }, { displayName: newName })
            .$promise
            .then(response => {
                this.getConfiguration(serviceName).then(configuration => this.changeMenuTitle(serviceName, configuration.displayName || serviceName));
                return response;
            })
            .catch(this.ServiceHelper.errorHandler("iplb_modal_name_change_updating_error"));
    }

    changeMenuTitle (serviceName, displayName) {
        const menuItem = this.SidebarMenu.getItemById(serviceName);
        if (menuItem) {
            menuItem.title = displayName;
        }
    }

    getSubscription (serviceName) {
        return this.$q.all({
            configuration: this.IpLoadBalancing.Lexi().get({ serviceName }).$promise,
            serviceInfos: this.IpLoadBalancing.Lexi().serviceInfos({ serviceName }).$promise
        })
            .then(response => _.extend(response.serviceInfos, { offer: response.configuration.offer }))
            .catch(this.ServiceHelper.errorHandler("iplb_subscription_loading_error"));
    }
}

angular.module("managerApp").service("IpLoadBalancerHomeService", IpLoadBalancerHomeService);
