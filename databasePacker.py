import openpyxl
import json

excelworkbook= openpyxl.load_workbook('lookupData\\objectives-en.xlsx')

advancements = excelworkbook["Advancements"]
achievments = excelworkbook["Achievements"]

def convertToJson(ws):
    dataStructure={}
    for row in ws.iter_rows(min_row=3,max_col=8):
        name = row[7].value.replace(" ","").replace("'","").replace(".","").replace("!","").replace("?","")
        category = row[4].value
        container = row[5].value
        containerIndex = row[6].value
        globalIndex = row[3].value
        displayname=row[0].value
        description=row[1].value
        if not(category in dataStructure.keys()):
            dataStructure[category]={}
        dataStructure[category][name]={"displayName": displayname,
                                       "description": description,
                                       "globalIndex": globalIndex,
                                       "container": container,
                                       "containerIndex": containerIndex}
    return dataStructure
with open("Pack Template\\scripts\\textObjects.js","w+") as file:
    file.write("export const achievements = " + json.dumps(convertToJson(achievments),indent=2) + ";\n")
    file.write("export const advancements = " + json.dumps(convertToJson(advancements),indent=2) + ";\n")
