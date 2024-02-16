import openpyxl
import json

excelworkbook= openpyxl.load_workbook('lookupData\\en.xlsx')

advancements = excelworkbook["Advancements"]
achievments = excelworkbook["Achievements"]

def convertToJson(ws,playerJson=True):
    dataStructure={}
    for row in ws.iter_rows(min_row=3,max_col=10):
        name = row[6].value.replace(" ","").replace("'","").replace(".","").replace("!","").replace("?","")
        row[6].value=name
        category = row[3].value
        container = row[4].value
        containerIndex = row[5].value
        globalIndex = row[9].value
        displayname=row[0].value
        description=row[1].value
        playerJsonRequired=row[8].value=="true"
        print(row[7].value)
        implemented=row[7].value
        if playerJson or not playerJsonRequired:
            dataStructure[name]={"displayName": displayname,
                                "description": description,
                                "globalIndex": globalIndex,
                                "category": category,
                                "container": container,
                                "implemented": implemented,
                                "containerIndex": int(containerIndex)-1}
    return dataStructure
with open("Pack Template\\scripts\\textObjects.js","w+") as file:
    file.write("export const achievements = " + json.dumps(convertToJson(achievments),indent=2) + ";\n")
    file.write("export const advancements = " + json.dumps(convertToJson(advancements),indent=2) + ";\n")
#excelworkbook.save('lookupData\\en.xlsx')
