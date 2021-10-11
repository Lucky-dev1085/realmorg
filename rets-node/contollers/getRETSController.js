let rets = require('rets-client');
let fs = require('fs');

let metaPropertySchema = require('../model/rets-metadata-Property');
let metaPropertyCalgarySchema = require('../model/rets-metadata-Property_Calgary_Residential');
let properyCitySchema = require('../model/rets-property-City');

let metaMemberSchema = require('../model/rets-metadata-Member');
let memberAORSchema = require('../model/rets-member-AOR');

let metaOfficeSchema = require('../model/rets-metadata-Office');
let officeTypeSchema = require('../model/rets-office-Type');

let metaPropertyRoomsSchema = require('../model/rets-metadata-PropertRooms');
let propertyRoomsFeatureSchema = require('../model/rets-propertyrooms-Features');

let metaMediaSchema = require('../model/rets-metadata-Media');
let mediaCategorySchema = require('../model/rets-media-Category');

let metaOpenhouseSchema = require('../model/rets-metadata-Openhouse');
let openhouseTypeSchema = require('../model/rets-openhouse-Type');

let metaPropertyUnitTypesSchema = require('../model/rets-metadata-PropertyUnitTypes');
let propertyUnitTyesSchema = require('../model/rets-propertyunittypes-Type');

let cronInfoSchema = require('../model/rets-cron-info');

let rets_AddressRelation = require('../model/rets-AddressRelation');

//create rets-client
var clientSettings = {
    loginUrl: 'https://matrixrets.pillarnine.com/rets/login.ashx',
    username: 'RNSIDHU',
    password: 'HBqnE10vEyRqJS12yjzs',
    version: 'RETS/1.7.2',
};

function outputFields(obj, opts) {
    if (!obj) {
      console.log("      "+JSON.stringify(obj))
    } else {
        if (!opts) opts = {};
    
        var excludeFields;
        var loopFields;
        if (opts.exclude) {
            excludeFields = opts.exclude;
            loopFields = Object.keys(obj);
        } else if (opts.fields) {
            loopFields = opts.fields;
            excludeFields = [];
        } else {
            loopFields = Object.keys(obj);
            excludeFields = [];
        }
        for (var i = 0; i < loopFields.length; i++) {
            if (excludeFields.indexOf(loopFields[i]) != -1) {
                continue;
            }
            if (typeof(obj[loopFields[i]]) == 'object') {
                console.log("      " + loopFields[i] + ": " + JSON.stringify(obj[loopFields[i]], null, 2).replace(/\n/g, '\n      '));
            } else {
                console.log("      " + loopFields[i] + ": " + JSON.stringify(obj[loopFields[i]]));
            }
        }
    }
    console.log("");
}

async function getTblData($resource, $class, $query, $limit, $offset) {
    console.log("-------- resource = ", $resource, " : class = ", $class, " : query = ", $query);
    let result_len = 0;
    await rets.getAutoLogoutClient(clientSettings, async function(client) {
        await client.search.query($resource, $class, $query, {limit: $limit, offset: $offset})
            .then(async function (searchData) {
                console.log("=========== limit = ", $limit, " : offset = ", $offset, " : result len = ", searchData.results.length);
                result_len = searchData.results.length;

                await searchData.results.reduce(async (accum, metadata) => {
                    await accum;

                    if($resource == "Property") {
                        await metaPropertySchema.updateOne(
                            {ListingKeyNumeric: metadata['ListingKeyNumeric']}, 
                            metadata,
                            {upsert: true}
                        ); 
                        
                        if(metadata['City'] == "Calgary" && metadata['PropertyType'] == "Residential") {
                            await metaPropertyCalgarySchema.updateOne(
                                {ListingKeyNumeric: metadata['ListingKeyNumeric']}, 
                                metadata,
                                {upsert: true}
                            ); 
                        }

                        var data = {};
                        data['StateOrProvince'] = metadata['StateOrProvince'];
                        data['CountyOrParish'] = metadata['CountyOrParish'];
                        data['City'] = metadata['City'];
                        data['District'] = metadata['District'];
                        data['SubdivisionName'] = metadata['SubdivisionName'];

                        await rets_AddressRelation.updateOne(
                        {
                            StateOrProvince: data['StateOrProvince'],
                            CountyOrParish: data['CountyOrParish'],
                            City: data['City'],
                            District: data['District'],
                            SubdivisionName: data['SubdivisionName']
                        }, 
                        data,
                        {upsert: true}
                        ); 
                        
                        console.log("~~~~~~~~~~~~~ Document media ~~", metadata['ListingKeyNumeric'], " ~~~~~~~~~~~~");
                        await client.objects.getAllObjects("Property", "Document", metadata['ListingKeyNumeric'], {alwaysGroupObjects: true, ObjectData: '*'})
                        .then(async function (mediaResults) {
                            for (var i = 0; i < mediaResults.objects.length; i++) {
                                console.log("   -------- Document " + i + " --------");
                                if (mediaResults.objects[i].error) {
                                    console.log("      Error: " + mediaResults.objects[i].error);
                                } else {
                                    if(mediaResults.objects[i].data === undefined) continue;
                                    fs.writeFileSync(
                                        "./data/Media/Document/" + metadata['ListingKeyNumeric'] + "_" + i + "." + mediaResults.objects[i].headerInfo.contentType.match(/\w+\/(\w+)/i)[1], mediaResults.objects[i].data);
                                }
                            }
                        }).catch(function (errorInfo) {
                            var error = errorInfo.error || errorInfo;
                            if(error['replyText'] == 'No object found.')console.log("   ERROR: issue encountered:", error['replyText']);
                            else outputFields(error);
                        });

                        console.log("~~~~~~~~~~~~~ LargePhoto media ~~", metadata['ListingKeyNumeric'], " ~~~~~~~~~~~~");
                        await client.objects.getAllObjects("Property", "LargePhoto", metadata['ListingKeyNumeric'], {alwaysGroupObjects: true, ObjectData: '*'})
                        .then(async function (mediaResults) {
                            for (var i = 0; i < mediaResults.objects.length; i++) {
                                console.log("   -------- LargePhoto " + i + " --------");
                                if (mediaResults.objects[i].error) {
                                    console.log("      Error: " + mediaResults.objects[i].error);
                                } else {
                                    if(mediaResults.objects[i].data === undefined) continue;
                                    fs.writeFileSync(
                                        "./data/Media/LargePhoto/" + metadata['ListingKeyNumeric'] + "_" + i + "." + mediaResults.objects[i].headerInfo.contentType.match(/\w+\/(\w+)/i)[1], mediaResults.objects[i].data);
                                }
                            }
                        }).catch(function (errorInfo) {
                            var error = errorInfo.error || errorInfo;
                            if(error['replyText'] == 'No object found.')console.log("   ERROR: issue encountered:", error['replyText']);
                            else outputFields(error);
                        });

                        console.log("~~~~~~~~~~~~~ Photo media ~~", metadata['ListingKeyNumeric'], " ~~~~~~~~~~~~");
                        await client.objects.getAllObjects("Property", "Photo", metadata['ListingKeyNumeric'], {alwaysGroupObjects: true, ObjectData: '*'})
                        .then(async function (mediaResults) {
                            for (var i = 0; i < mediaResults.objects.length; i++) {
                                console.log("   -------- Photo " + i + " --------");
                                if (mediaResults.objects[i].error) {
                                    console.log("      Error: " + mediaResults.objects[i].error);
                                } else {
                                    if(mediaResults.objects[i].data === undefined) continue;
                                    fs.writeFileSync(
                                        "./data/Media/Photo/" + metadata['ListingKeyNumeric'] + "_" + i + "." + mediaResults.objects[i].headerInfo.contentType.match(/\w+\/(\w+)/i)[1], mediaResults.objects[i].data);
                                }
                            }
                        }).catch(function (errorInfo) {
                            var error = errorInfo.error || errorInfo;
                            if(error['replyText'] == 'No object found.')console.log("   ERROR: issue encountered:", error['replyText']);
                            else outputFields(error);
                        });

                        console.log("~~~~~~~~~~~~~ XLarge media ~~", metadata['ListingKeyNumeric'], " ~~~~~~~~~~~~");
                        // await client.objects.getAllObjects("Property", "XLarge", metadata['ListingKeyNumeric'], {alwaysGroupObjects: true, ObjectData: '*'})
                        // .then(async function (mediaResults) {
                        //     for (var i = 0; i < mediaResults.objects.length; i++) {
                        //         console.log("   -------- XLarge " + i + " --------");
                        //         if (mediaResults.objects[i].error) {
                        //             console.log("      Error: " + mediaResults.objects[i].error);
                        //         } else {
                        //             if(mediaResults.objects[i].data === undefined) continue;
                        //             fs.writeFileSync(
                        //                 "./data/Media/XLarge/" + metadata['ListingKeyNumeric'] + "_" + i + "." + mediaResults.objects[i].headerInfo.contentType.match(/\w+\/(\w+)/i)[1], mediaResults.objects[i].data);
                        //         }
                        //     }
                        // }).catch(function (errorInfo) {
                        //     var error = errorInfo.error || errorInfo;
                        //     if(error['replyText'] == 'No object found.')console.log("   ERROR: issue encountered:", error['replyText']);
                        //     else outputFields(error);
                        // });
                    } else if($resource == "Member") {
                        await metaMemberSchema.updateOne(
                            {MemberKeyNumeric: metadata['MemberKeyNumeric']}, 
                            metadata,
                            {upsert: true}
                        ); 
                    } else if($resource == "Office") {
                        await metaOfficeSchema.updateOne(
                            {OfficeKeyNumeric: metadata['OfficeKeyNumeric']}, 
                            metadata,
                            {upsert: true}
                        ); 
                    } else if($resource == "PropertyRooms") {
                        await metaPropertyRoomsSchema.updateOne(
                            {RoomKeyNumeric: metadata['RoomKeyNumeric']}, 
                            metadata,
                            {upsert: true}
                        ); 
                    } else if($resource == "Media") {
                        await metaMediaSchema.updateOne(
                            {MediaKeyNumeric: metadata['MediaKeyNumeric']}, 
                            metadata,
                            {upsert: true}
                        ); 
                    } else if($resource == "Openhouse") {
                        await metaOpenhouseSchema.updateOne(
                            {OpenHouseKeyNumeric: metadata['OpenHouseKeyNumeric']}, 
                            metadata,
                            {upsert: true}
                        ); 
                    } else if($resource == "PropertyUnitTypes") {
                        await metaPropertyUnitTypesSchema.updateOne(
                            {UnitTypeKeyNumeric: metadata['UnitTypeKeyNumeric']}, 
                            metadata,
                            {upsert: true}
                        ); 
                    }
                    
                }, Promise.resolve(''));
                console.log("+++++++++++++++++ add data +++++++++++++++++++ ");
            });
    }).catch(function (errorInfo) {
        var error = errorInfo.error || errorInfo;
        if(error['replyText'] == 'No Records Found.')console.log("   ERROR: issue encountered:", error['replyText']);
        else outputFields(error);
    });

    return (result_len == $limit ? true : false);
}

async function getMetaDataFromRETS() {
    var $limit = 100;
    var $offset = 0;
    var cronInfo = {Property: '', Member: '', Media: '', Office: '', Openhouse: '', PropertyRoom: '', PropertyUnitTypes: ''};

    /***********************************************
     * Property
     */
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("+++++++++++++++++++++++ Property Start +++++++++++++++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

    let arr_PropertyCity = await properyCitySchema.find();

    arr_PropertyCity.push({'Value': '.EMPTY.', 'Short Value': '', 'Long Value': ''});

    const property1 = await arr_PropertyCity.reduce(async (accum, city) => {
        await accum;

        var query = "((City=" + city['Value'] + "),(StandardStatus=A,P))";

        var loop_continue = true;
        $offset = 0;
        while(loop_continue) {
            loop_continue = await getTblData("Property", "Property", query, $limit, $offset);
            $offset += $limit;
            console.log("--------------------------------------------------");
        }

    }, Promise.resolve(''));

    var cronDate = new Date();
    cronInfo['Property'] = cronDate;

    console.log("********************************************************************");
    console.log("************************ Property Finished *************************");
    console.log("********************************************************************");

    /***********************************************
     * Member
     */
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("+++++++++++++++++++++++ Member Start +++++++++++++++++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

    let arr_MemberAOR = await memberAORSchema.find();

    arr_MemberAOR.push({'Value': '.EMPTY.', 'Short Value': '', 'Long Value': ''});

    const member1 = await arr_MemberAOR.reduce(async (accum, memberAOR) => {
        await accum;

        var query = "(MemberAOR=" + memberAOR['Value'] + ")";

        var loop_continue = true;
        $offset = 0;
        while(loop_continue) {
            loop_continue = await getTblData("Member", "Member", query, $limit, $offset);
            $offset += $limit;
            console.log("--------------------------------------------------");
        }

    }, Promise.resolve(''));

    cronDate = new Date();
    cronInfo['Member'] = cronDate;

    console.log("********************************************************************");
    console.log("************************ Member Finished ***************************");
    console.log("********************************************************************");

    /***********************************************
     * Office
     */
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("+++++++++++++++++++++++ Office Start +++++++++++++++++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

    let arr_OfficeType = await officeTypeSchema.find();

    arr_OfficeType.push({'Value': '.EMPTY.', 'Short Value': '', 'Long Value': ''});
        
    const office2 = await arr_OfficeType.reduce(async (accum, officeType) => {
        await accum;

        var query = "(OfficeType=" + officeType['Value'] + ")";

        var loop_continue = true;
        $offset = 0;
        while(loop_continue) {
            loop_continue = await getTblData("Office", "Office", query, $limit, $offset);
            $offset += $limit;
            console.log("--------------------------------------------------");
        }
    }, Promise.resolve(''));

    cronDate = new Date();
    cronInfo['Office'] = cronDate;

    console.log("********************************************************************");
    console.log("************************ Office Finished ***************************");
    console.log("********************************************************************");

    /***********************************************
     * PropertyRooms
     */
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("+++++++++++++++++++++++ PropertyRooms Start ++++++++++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

    let arr_RoomFeature = await propertyRoomsFeatureSchema.find();

    arr_RoomFeature.push({'Value': '.EMPTY.', 'Short Value': '', 'Long Value': ''});

    const room1 = await arr_RoomFeature.reduce(async (accum, roomFeature) => {
        await accum;

        var query = "(RoomFeatures=" + roomFeature['Value'] + ")";

        var loop_continue = true;
        $offset = 0;
        while(loop_continue) {
            loop_continue = await getTblData("PropertyRooms", "PropertyRooms", query, $limit, $offset);
            $offset += $limit;
            console.log("--------------------------------------------------");
        }

    }, Promise.resolve(''));

    cronDate = new Date();
    cronInfo['PropertyRoom'] = cronDate;

    console.log("********************************************************************");
    console.log("************************ PropertyRooms Finished ********************");
    console.log("********************************************************************");

    /***********************************************
     * Media
     */
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("+++++++++++++++++++++++ Media Start ++++++++++++++++++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

    let arr_MediaCategory = await mediaCategorySchema.find();

    arr_MediaCategory.push({'Value': '.EMPTY.', 'Short Value': '', 'Long Value': ''});

    const media1 = await arr_MediaCategory.reduce(async (accum, mediaCategory) => {
        await accum;

        var query = "(MediaCategory=" + mediaCategory['Value'] + ")";

        var loop_continue = true;
        $offset = 0;
        while(loop_continue) {
            loop_continue = await getTblData("Media", "Media", query, $limit, $offset);
            $offset += $limit;
            console.log("--------------------------------------------------");
        }

    }, Promise.resolve(''));

    cronDate = new Date();
    cronInfo['Media'] = cronDate;

    console.log("********************************************************************");
    console.log("************************ Media Finished ****************************");
    console.log("********************************************************************");

    /***********************************************
     * Openhouse
     */
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("+++++++++++++++++++++++ Openhouse Start ++++++++++++++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

    let arr_OpenhouseType = await openhouseTypeSchema.find();

    arr_OpenhouseType.push({'Value': '.EMPTY.', 'Short Value': '', 'Long Value': ''});

    const oht1 = await arr_OpenhouseType.reduce(async (accum, housetype) => {
        await accum;

        var query = "(OpenHouseType=" + housetype['Value'] + ")";

        var loop_continue = true;
        $offset = 0;
        while(loop_continue) {
            loop_continue = await getTblData("Openhouse", "OpenHouse", query, $limit, $offset);
            $offset += $limit;
            console.log("--------------------------------------------------");
        }
    }, Promise.resolve(''));

    cronDate = new Date();
    cronInfo['Openhouse'] = cronDate;

    console.log("********************************************************************");
    console.log("************************ Openhouse Finished ************************");
    console.log("********************************************************************");

    /***********************************************
     * PropertyUnitTypes
     */
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("+++++++++++++++++++ PropertyUnitTypes Start ++++++++++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

    let arr_unitType = await propertyUnitTyesSchema.find();

    arr_unitType.push({'Value': '.EMPTY.', 'Short Value': '', 'Long Value': ''});

    const put1 = await arr_unitType.reduce(async (accum, unittype) => {
        await accum;

        var query = "(UnitTypeType=" + unittype['Value'] + ")";

        var loop_continue = true;
        $offset = 0;
        while(loop_continue) {
            loop_continue = await getTblData("PropertyUnitTypes", "PropertyUnitTypes", query, $limit, $offset);
            $offset += $limit;
            console.log("--------------------------------------------------");
        }
    }, Promise.resolve(''));

    cronDate = new Date();
    cronInfo['PropertyUnitTypes'] = cronDate;

    console.log("********************************************************************");
    console.log("******************** PropertyUnitTypes Finished ********************");
    console.log("********************************************************************");

    cronInfoSchema.create(cronInfo, (error, data) => {
        if (error) {
            console.log(error);
        } else {
            console.log(data);
        }
    })
}

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

async function getNewDataUpdate() {
    var $limit = 100;
    var $offset = 0;
    var cronInfoArr = cronInfoSchema.find();

    var cronId = '';
    var propertyCronDate = '';
    var memberCronDate = '';
    var mediaCronDate = '';
    var officeCronDate = '';
    var openhouseCronDate = '';
    var propertyroomCronDate = '';
    var propertyunittypesCronDate = '';
    (await cronInfoArr).forEach(val => {
        cronId = val['_id'];
        var cronDate = new Date(val['Property']);

        propertyCronDate = cronDate.getFullYear() + "-" + addZero(cronDate.getMonth() + 1) + "-" + addZero(cronDate.getDate()) + "T" + addZero(cronDate.getHours()) + ":" + addZero(cronDate.getMinutes()) + ":" + addZero(cronDate.getSeconds());

        cronDate = new Date(val['Member']);
        memberCronDate = cronDate.getFullYear() + "-" + addZero(cronDate.getMonth() + 1) + "-" + addZero(cronDate.getDate()) + "T" + addZero(cronDate.getHours()) + ":" + addZero(cronDate.getMinutes()) + ":" + addZero(cronDate.getSeconds());

        cronDate = new Date(val['Media']);
        mediaCronDate = cronDate.getFullYear() + "-" + addZero(cronDate.getMonth() + 1) + "-" + addZero(cronDate.getDate()) + "T" + addZero(cronDate.getHours()) + ":" + addZero(cronDate.getMinutes()) + ":" + addZero(cronDate.getSeconds());
        
        cronDate = new Date(val['Office']);
        officeCronDate = cronDate.getFullYear() + "-" + addZero(cronDate.getMonth() + 1) + "-" + addZero(cronDate.getDate()) + "T" + addZero(cronDate.getHours()) + ":" + addZero(cronDate.getMinutes()) + ":" + addZero(cronDate.getSeconds());

        cronDate = new Date(val['Openhouse']);
        openhouseCronDate = cronDate.getFullYear() + "-" + addZero(cronDate.getMonth() + 1) + "-" + addZero(cronDate.getDate()) + "T" + addZero(cronDate.getHours()) + ":" + addZero(cronDate.getMinutes()) + ":" + addZero(cronDate.getSeconds());

        cronDate = new Date(val['PropertyRoom']);
        propertyroomCronDate = cronDate.getFullYear() + "-" + addZero(cronDate.getMonth() + 1) + "-" + addZero(cronDate.getDate()) + "T" + addZero(cronDate.getHours()) + ":" + addZero(cronDate.getMinutes()) + ":" + addZero(cronDate.getSeconds());

        cronDate = new Date(val['PropertyUnitTypes']);
        propertyunittypesCronDate = cronDate.getFullYear() + "-" + addZero(cronDate.getMonth() + 1) + "-" + addZero(cronDate.getDate()) + "T" + addZero(cronDate.getHours()) + ":" + addZero(cronDate.getMinutes()) + ":" + addZero(cronDate.getSeconds());
    })

    var curDateTime = new Date();

    var cronInfo = {Property: curDateTime, Member: curDateTime, Media: curDateTime, Office: curDateTime, Openhouse: curDateTime, PropertyRoom: curDateTime, PropertyUnitTypes: curDateTime};

    // var cronDate = cronInfo['Property'] + "+";
    var curDateTimeStamp = curDateTime.getFullYear() + "-" + addZero(curDateTime.getMonth() + 1) + "-" + addZero(curDateTime.getDate()) + "T" + addZero(curDateTime.getHours()) + ":" + addZero(curDateTime.getMinutes()) + ":" + addZero(curDateTime.getSeconds());

    /***********************************************
     * Property
     */
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("+++++++++++++++++++++++ Property Start +++++++++++++++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

    var query = "(ModificationTimestamp=" + propertyCronDate + "-" + curDateTimeStamp + ")";

    var loop_continue = true;
    $offset = 0;
    while(loop_continue) {
        loop_continue = await getTblData("Property", "Property", query, $limit, $offset);
        $offset += $limit;
        console.log("--------------------------------------------------");
    }

    console.log("********************************************************************");
    console.log("************************ Property Finished *************************");
    console.log("********************************************************************");

    /***********************************************
     * Member
     */
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("+++++++++++++++++++++++ Member Start +++++++++++++++++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

    query = "(ModificationTimestamp=" + memberCronDate + "-" + curDateTimeStamp + ")";

    loop_continue = true;
    $offset = 0;
    while(loop_continue) {
        loop_continue = await getTblData("Member", "Member", query, $limit, $offset);
        $offset += $limit;
        console.log("--------------------------------------------------");
    }

    console.log("********************************************************************");
    console.log("************************ Member Finished ***************************");
    console.log("********************************************************************");

    /***********************************************
     * Office
     */
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("+++++++++++++++++++++++ Office Start +++++++++++++++++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

    query = "(ModificationTimestamp=" + officeCronDate + "-" + curDateTimeStamp + ")";

    loop_continue = true;
    $offset = 0;
    while(loop_continue) {
        loop_continue = await getTblData("Office", "Office", query, $limit, $offset);
        $offset += $limit;
        console.log("--------------------------------------------------");
    }

    console.log("********************************************************************");
    console.log("************************ Office Finished ***************************");
    console.log("********************************************************************");

    /***********************************************
     * PropertyRooms
     */
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("+++++++++++++++++++++++ PropertyRooms Start ++++++++++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

    query = "(ModificationTimestamp=" + propertyroomCronDate + "-" + curDateTimeStamp + ")";

    loop_continue = true;
    $offset = 0;
    while(loop_continue) {
        loop_continue = await getTblData("PropertyRooms", "PropertyRooms", query, $limit, $offset);
        $offset += $limit;
        console.log("--------------------------------------------------");
    }

    console.log("********************************************************************");
    console.log("************************ PropertyRooms Finished ********************");
    console.log("********************************************************************");

    /***********************************************
     * Media
     */
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("+++++++++++++++++++++++ Media Start ++++++++++++++++++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

    query = "(ModificationTimestamp=" + mediaCronDate + "-" + curDateTimeStamp + ")";

    loop_continue = true;
    $offset = 0;
    while(loop_continue) {
        loop_continue = await getTblData("Media", "Media", query, $limit, $offset);
        $offset += $limit;
        console.log("--------------------------------------------------");
    }

    console.log("********************************************************************");
    console.log("************************ Media Finished ****************************");
    console.log("********************************************************************");

    /***********************************************
     * Openhouse
     */
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("+++++++++++++++++++++++ Openhouse Start ++++++++++++++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

    query = "(ModificationTimestamp=" + openhouseCronDate + "-" + curDateTimeStamp + ")";

    var loop_continue = true;
    $offset = 0;
    while(loop_continue) {
        loop_continue = await getTblData("Openhouse", "OpenHouse", query, $limit, $offset);
        $offset += $limit;
        console.log("--------------------------------------------------");
    }

    console.log("********************************************************************");
    console.log("************************ Openhouse Finished ************************");
    console.log("********************************************************************");

    /***********************************************
     * PropertyUnitTypes
     */
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("+++++++++++++++++++ PropertyUnitTypes Start ++++++++++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

    query = "(ModificationTimestamp=" + propertyunittypesCronDate + "-" + curDateTimeStamp + ")";

    loop_continue = true;
    $offset = 0;
    while(loop_continue) {
        loop_continue = await getTblData("PropertyUnitTypes", "PropertyUnitTypes", query, $limit, $offset);
        $offset += $limit;
        console.log("--------------------------------------------------");
    }

    console.log("********************************************************************");
    console.log("******************** PropertyUnitTypes Finished ********************");
    console.log("********************************************************************");

    cronInfoSchema.findByIdAndUpdate(cronId, cronInfo, (error, data) => {
        if (error) {
            console.log(error);
        } else {
            console.log(data);
        }
    })
}

async function getMetaDataFromRETSStartCity($city) {
    var $limit = 300;
    var $offset = 0;
    var cronInfo = {Property: '', Member: '', Media: '', Office: '', Openhouse: '', PropertyRoom: '', PropertyUnitTypes: ''};

    var cronDate = new Date();
    cronInfo['Property'] = cronDate;

    cronDate = new Date();
    cronInfo['Member'] = cronDate;

    cronDate = new Date();
    cronInfo['Office'] = cronDate;

    cronDate = new Date();
    cronInfo['Media'] = cronDate;

    cronDate = new Date();
    cronInfo['Openhouse'] = cronDate;

    cronDate = new Date();
    cronInfo['PropertyUnitTypes'] = cronDate;

    /***********************************************
     * Media
     */
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("+++++++++++++++++++++++ Media Start ++++++++++++++++++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

    // let arr_MediaCategory = await mediaCategorySchema.find();

    // arr_MediaCategory.push({'Value': '.EMPTY.', 'Short Value': '', 'Long Value': ''});

    // const media1 = await arr_MediaCategory.reduce(async (accum, mediaCategory) => {
    //     await accum;

    //     var query = "(MediaCategory=" + mediaCategory['Value'] + ")";

    //     var loop_continue = true;
    //     $offset = 0;
    //     if(mediaCategory['Value'] == "PHO") $offset = 809700;

    //     while(loop_continue) {
    //         loop_continue = await getTblData("Media", "Media", query, $limit, $offset);
    //         $offset += $limit;
    //         console.log("--------------------------------------------------");
    //     }

    // }, Promise.resolve(''));

    cronDate = new Date();
    cronInfo['Media'] = cronDate;

    console.log("********************************************************************");
    console.log("************************ Media Finished ****************************");
    console.log("********************************************************************");

    /***********************************************
     * PropertyRooms
     */
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log("+++++++++++++++++++++++ PropertyRooms Start ++++++++++++++++++++++++");
    console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

    // let arr_RoomFeature = await propertyRoomsFeatureSchema.find();

    // arr_RoomFeature.push({'Value': '.EMPTY.', 'Short Value': '', 'Long Value': ''});

    // const room1 = await arr_RoomFeature.reduce(async (accum, roomFeature) => {
    //     await accum;

    //     var query = "(RoomFeatures=" + roomFeature['Value'] + ")";

    //     var loop_continue = true;
    //     $offset = 1393400;
    //     while(loop_continue) {
    //         loop_continue = await getTblData("PropertyRooms", "PropertyRooms", query, $limit, $offset);
    //         $offset += $limit;
    //         console.log("--------------------------------------------------");
    //     }

    // }, Promise.resolve(''));

    cronDate = new Date();
    cronInfo['PropertyRoom'] = cronDate;

    console.log("********************************************************************");
    console.log("************************ PropertyRooms Finished ********************");
    console.log("********************************************************************");

    cronInfoSchema.create(cronInfo, (error, data) => {
        if (error) {
            console.log(error);
        } else {
            console.log(data);
        }
    })
}

exports.getMetaData = function(req, res) {
    
    getMetaDataFromRETS();

    res.send('getRETSController');
}

exports.getMetaDataFromCity = function(req, res) {
    getMetaDataFromRETSStartCity(req.params.city);

    res.send('getMetaDataFromRETSStartCity = ' + req.params.city);
}

exports.getNewData = function(req, res) {
    getNewDataUpdate();

    res.send('getNewRETSData');
}