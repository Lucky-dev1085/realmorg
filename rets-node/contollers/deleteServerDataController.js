let fs = require('fs');

let metaPropertySchema = require('../model/rets-metadata-Property');
let metaPropertyCalgarySchema = require('../model/rets-metadata-Property_Calgary_Residential');

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function deleteSoldDataModule() {
    var curDateTime = new Date();

    var modificationDateTime = new Date(curDateTime.getFullYear(), curDateTime.getMonth(), curDateTime.getDate() - 180, curDateTime.getHours(), curDateTime.getMinutes(), curDateTime.getSeconds());
    var modificationTimeStamp = modificationDateTime.getFullYear() + "-" + addZero(modificationDateTime.getMonth() + 1) + "-" + addZero(modificationDateTime.getDate()) + "T" + addZero(modificationDateTime.getHours()) + ":" + addZero(modificationDateTime.getMinutes()) + ":" + addZero(modificationDateTime.getSeconds());

    console.log(modificationTimeStamp);

    metaPropertySchema.find(
        {"StandardStatus": "Sold", "ModificationTimestamp": { $lt: modificationTimeStamp }}, 
        function(err, data) {
            if(err) {
                console.log(err);
                return;
            }
            if(!data) {
                console.log("Not Found");
                return;
            }
            data.forEach(val => {
                metaPropertySchema.remove({ListingKeyNumeric: val['ListingKeyNumeric']}, function(error) {
                    if(error) {
                        console.log(error);
                    } else {
                        console.log("------- ", val['ListingKeyNumeric'], "  deleted");
                    }
                })

                fs.readdirSync("./data/Media/Document").forEach(file => {
        
                    if(file.includes(val['ListingKeyNumeric'] + "_")) {
                        console.log("------- Document/", file, "    deleted");
                        fs.unlinkSync("./data/Media/Document/" + file);
                    }
                });

                fs.readdirSync("./data/Media/LargePhoto").forEach(file => {
        
                    if(file.includes(val['ListingKeyNumeric'] + "_")) {
                        console.log("------- LargePhoto/", file, "    deleted");
                        fs.unlinkSync("./data/Media/LargePhoto/" + file);
                    }
                });

                fs.readdirSync("./data/Media/Photo").forEach(file => {
        
                    if(file.includes(val['ListingKeyNumeric'] + "_")) {
                        console.log("------- Photo/", file, "    deleted");
                        fs.unlinkSync("./data/Media/Photo/" + file);
                    }
                });

                // fs.readdirSync("./data/Media/XLarge").forEach(file => {
        
                //     if(file.includes(val['ListingKeyNumeric'] + "_")) {
                //         console.log("------- XLarge/", file, "    deleted");
                //         fs.unlinkSync("./data/Media/XLarge/" + file);
                //     }
                // });
            });
        }
    );

    metaPropertyCalgarySchema.find(
        {"StandardStatus": "Sold", "ModificationTimestamp": { $lt: modificationTimeStamp }}, 
        function(err, data) {
            if(err) {
                console.log(err);
                return;
            }
            if(!data) {
                console.log("Not Found");
                return;
            }
            data.forEach(val => {
                metaPropertyCalgarySchema.remove({ListingKeyNumeric: val['ListingKeyNumeric']}, function(error) {
                    if(error) {
                        console.log(error);
                    } else {
                        console.log("------- ", val['ListingKeyNumeric'], "  deleted");
                    }
                })
            });
        }
    );
}

exports.deleteSoldData = function(req, res) {
    console.log("Deleting Sold Data Cron job.");
    
    deleteSoldDataModule();

    res.send('deleteSoldData');
}