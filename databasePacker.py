import openpyxl
import json

excelworkbook= openpyxl.load_workbook('lookupData\\achievements.xlsx')

advancements = excelworkbook["Advancements"]
achievments = excelworkbook["Achievements"]

def convertToJson(ws):
    dataStructure={}
    for row in ws.iter_rows(min_row=1,max_col=6):
        name=row[0].value.replace(" ","")
        displayname=row[0].value
        description=row[1].value
        #comment=row[3].value
        dataStructure[name]={"displayName":displayname,"description":description}
    return dataStructure
with open("textObjects.js","w+") as file:
    file.write("advancements = "+json.dumps(convertToJson(advancements),indent=2))
    file.write("achievements = "+json.dumps(convertToJson(achievments),indent=2))

