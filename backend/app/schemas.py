from typing import Any, Literal

from pydantic import BaseModel, EmailStr, Field


class Attribution(BaseModel):
    utm_source: str | None = None
    utm_medium: str | None = None
    utm_campaign: str | None = None
    utm_content: str | None = None
    utm_term: str | None = None
    fbclid: str | None = None
    fbp: str | None = None
    fbc: str | None = None
    ttclid: str | None = None
    ttp: str | None = None
    sc_click_id: str | None = None
    sc_cookie1: str | None = None
    landing_page: str | None = None
    referrer: str | None = None
    consent: bool | None = None


class OrderItemIn(BaseModel):
    sku: str
    offer_id: Literal["solo", "duo", "pair", "vault", "addon", "vault_duo"] = "solo"
    qty: int = 1
    unit_price: float | None = None


class OrderCreate(BaseModel):
    client_order_id: str
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    locale: str = "ar"
    items: list[OrderItemIn]
    currency: str = "USD"
    attribution: Attribution = Field(default_factory=Attribution)
    event_id: str
    event_id_lead: str | None = None
    event_source_url: str | None = None
    user_agent: str | None = None
    test_event_code: str | None = None


class UpsellCreate(BaseModel):
    sku: str | None = None
    event_id: str
    event_source_url: str | None = None
    user_agent: str | None = None


class ContactCreate(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    message: str = Field(min_length=4, max_length=4000)
    locale: str = "en"


class TrackContent(BaseModel):
    id: str | None = None
    content_id: str | None = None
    quantity: int = 1
    item_price: float | None = None
    price: float | None = None
    content_name: str | None = None
    content_type: str | None = None


class TrackUser(BaseModel):
    email: str | None = None
    name: str | None = None
    phone: str | None = None


class TrackEvent(BaseModel):
    event_name: str
    event_id: str
    event_source_url: str | None = None
    value: float | None = None
    currency: str = "USD"
    contents: list[TrackContent] = Field(default_factory=list)
    user: TrackUser = Field(default_factory=TrackUser)
    fbp: str | None = None
    fbc: str | None = None
    ttclid: str | None = None
    ttp: str | None = None
    sc_click_id: str | None = None
    sc_cookie1: str | None = None
    consent: bool | None = None
    order_id: str | None = None
    extra: dict[str, Any] = Field(default_factory=dict)
