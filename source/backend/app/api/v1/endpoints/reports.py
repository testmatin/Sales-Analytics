from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy.orm import Session

from app.api.dependencies import get_db, require_roles
from app.services.report_service import ReportService

router = APIRouter()
service = ReportService()

@router.get("")
def reports(db: Session = Depends(get_db)):
    return service.list(db)

@router.post("/generate", dependencies=[Depends(require_roles("admin", "manager", "analyst"))])
def generate(report_type: str = Query(..., alias="type"), format: str = Query("csv", pattern="^(csv|json)$")):
    return {"id": report_type, "format": format, "status": "ready", "download_url": f"/api/v1/reports/{report_type}/download?format={format}"}

@router.get("/{report_type}/download", dependencies=[Depends(require_roles("admin", "manager", "analyst"))])
def download(report_type: str, format: str = Query("csv", pattern="^(csv|json)$"), db: Session = Depends(get_db)):
    if format == "json":
        content = service.json_bytes(db, report_type)
        media_type = "application/json; charset=utf-8"
        filename = f"{report_type}-report.json"
    else:
        content = service.csv_bytes(db, report_type)
        media_type = "text/csv; charset=utf-8"
        filename = f"{report_type}-report.csv"
    return Response(content=content, media_type=media_type, headers={"Content-Disposition": f'attachment; filename="{filename}"'})
