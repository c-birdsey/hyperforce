public inherited sharing class OrgController {
    @AuraEnabled(cacheable=true)
    public static List<Org__c> getAllOrgData() {
        return [
            SELECT Id, Org_ID__c, Compliance__c, Name, Code__c, Infrastructure__c, Org_Type__c, Region__c, Status__c, Longitude__c, Latitude__c 
            FROM Org__c
        ];
    }

   @AuraEnabled(cacheable=true)
    public static List<Org__c> getOrgModalData() {
        return [
            SELECT Name, Region__c, Id
            FROM Org__c
        ];
    }
        
    @AuraEnabled(cacheable=true)
        public static Org__c getOrg(String orgName) {
            return [
                SELECT Id, Org_ID__c, Compliance__c, Name, Code__c, Infrastructure__c, Org_Type__c, Region__c, Status__c, Longitude__c, Latitude__c                 
                FROM Org__c
                WHERE Name = :orgName
            ];
        }
}
