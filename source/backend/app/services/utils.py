def paginate(items, page: int, page_size: int):
    total = len(items)
    start = (page - 1) * page_size
    return {"items": items[start:start + page_size], "page": page, "page_size": page_size, "total": total, "pages": max(1, (total + page_size - 1) // page_size)}
