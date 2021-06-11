public inherited sharing class RegionController {
    @AuraEnabled(cacheable=true)
    public static List<Region__c> getAllRegionData() {
        return [
            SELECT Id, Name, Code__c, Availability__c, Available_Zones__c, Boundary__c, Capacity__c, Instances__c, Latency__c, Compliance__c, Longitude__c, Latitude__c
            FROM Region__c
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<Region__c> getRegionModalData() {
        return [
            SELECT Id, Name
            FROM Region__c
        ];
    }

    @AuraEnabled(cacheable=true)
    public static Region__c getRegion(String regionName) {
        return [
            SELECT Id, Name, Code__c, Availability__c, Available_Zones__c, Boundary__c, Capacity__c, Instances__c, Latency__c, Compliance__c, Longitude__c, Latitude__c
            FROM Region__c
            WHERE Name = :regionName
        ];
    }
}
