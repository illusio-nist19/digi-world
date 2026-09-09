from datetime import datetime
from uuid import uuid4

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class Collection(Base):
    __tablename__ = "collections"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    name: Mapped[dict] = mapped_column(JSONB)
    sub: Mapped[dict] = mapped_column(JSONB)
    image: Mapped[str] = mapped_column(String(255))
    sort: Mapped[int] = mapped_column(Integer, default=0)
    products: Mapped[list["Product"]] = relationship(back_populates="collection")


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    sku: Mapped[str] = mapped_column(String(40), unique=True, index=True)
    slug: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    collection_id: Mapped[int] = mapped_column(ForeignKey("collections.id"))
    type: Mapped[str] = mapped_column(String(20))
    serial: Mapped[str | None] = mapped_column(String(40), nullable=True)
    name: Mapped[dict] = mapped_column(JSONB)
    sub: Mapped[dict] = mapped_column(JSONB)
    headline: Mapped[dict] = mapped_column(JSONB)
    description: Mapped[dict] = mapped_column(JSONB)
    contents: Mapped[dict] = mapped_column(JSONB)
    faq: Mapped[dict] = mapped_column(JSONB)
    images: Mapped[list] = mapped_column(JSONB)
    price_cents: Mapped[int] = mapped_column(Integer)
    compare_cents: Mapped[int | None] = mapped_column(Integer, nullable=True)
    duo_price_cents: Mapped[int | None] = mapped_column(Integer, nullable=True)
    pair_sku: Mapped[str | None] = mapped_column(String(80), nullable=True)
    pair_price_cents: Mapped[int | None] = mapped_column(Integer, nullable=True)
    upsell_sku: Mapped[str | None] = mapped_column(String(80), nullable=True)
    upsell_price_cents: Mapped[int | None] = mapped_column(Integer, nullable=True)
    cross_sell: Mapped[list] = mapped_column(JSONB, default=list)
    includes: Mapped[list | None] = mapped_column(JSONB, nullable=True)
    license_pool: Mapped[int] = mapped_column(Integer, default=500)
    licenses_issued: Mapped[int] = mapped_column(Integer, default=0)
    drop_label: Mapped[str] = mapped_column(String(40), default="Drop 01 — 2026")
    gender: Mapped[str | None] = mapped_column(String(20), nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    sort: Mapped[int] = mapped_column(Integer, default=0)
    collection: Mapped[Collection] = relationship(back_populates="products")


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    product_sku: Mapped[str] = mapped_column(String(40), index=True)
    locale: Mapped[str] = mapped_column(String(8), default="en")
    stars: Mapped[int] = mapped_column(Integer)
    title: Mapped[str] = mapped_column(String(160))
    body: Mapped[str] = mapped_column(Text)
    display_name: Mapped[str] = mapped_column(String(80))
    city_country: Mapped[str] = mapped_column(String(80))
    verified: Mapped[bool] = mapped_column(Boolean, default=True)
    source: Mapped[str] = mapped_column(String(40), default="studio_preview")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[str] = mapped_column(UUID(as_uuid=False), primary_key=True, default=lambda: str(uuid4()))
    public_id: Mapped[str] = mapped_column(String(24), unique=True, index=True)
    client_order_id: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    status: Mapped[str] = mapped_column(String(32), default="lead")
    name: Mapped[str] = mapped_column(String(80))
    email: Mapped[str] = mapped_column(String(160), index=True)
    locale: Mapped[str] = mapped_column(String(8), default="ar")
    currency: Mapped[str] = mapped_column(String(8), default="USD")
    subtotal_cents: Mapped[int] = mapped_column(Integer)
    discount_cents: Mapped[int] = mapped_column(Integer, default=0)
    upsell_cents: Mapped[int] = mapped_column(Integer, default=0)
    total_cents: Mapped[int] = mapped_column(Integer)
    attribution: Mapped[dict] = mapped_column(JSONB, default=dict)
    user_agent: Mapped[str | None] = mapped_column(Text, nullable=True)
    ip: Mapped[str | None] = mapped_column(String(64), nullable=True)
    event_id_purchase: Mapped[str | None] = mapped_column(String(80), nullable=True)
    event_id_lead: Mapped[str | None] = mapped_column(String(80), nullable=True)
    checkout_mode: Mapped[str] = mapped_column(String(20), default="lead")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    items: Mapped[list["OrderItem"]] = relationship(back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    order_id: Mapped[str] = mapped_column(UUID(as_uuid=False), ForeignKey("orders.id"))
    sku: Mapped[str] = mapped_column(String(40))
    offer_id: Mapped[str] = mapped_column(String(20))
    name: Mapped[str] = mapped_column(String(160))
    qty: Mapped[int] = mapped_column(Integer, default=1)
    unit_price_cents: Mapped[int] = mapped_column(Integer)
    is_upsell: Mapped[bool] = mapped_column(Boolean, default=False)
    extra: Mapped[dict] = mapped_column("meta", JSONB, default=dict)
    order: Mapped[Order] = relationship(back_populates="items")


class TrackingEvent(Base):
    __tablename__ = "tracking_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    event_id: Mapped[str] = mapped_column(String(80), unique=True, index=True)
    event_name: Mapped[str] = mapped_column(String(40))
    order_id: Mapped[str | None] = mapped_column(UUID(as_uuid=False), nullable=True)
    payload_redacted: Mapped[dict] = mapped_column(JSONB, default=dict)
    platforms: Mapped[dict] = mapped_column(JSONB, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class Contact(Base):
    __tablename__ = "contacts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(80))
    email: Mapped[str] = mapped_column(String(160))
    message: Mapped[str] = mapped_column(Text)
    locale: Mapped[str] = mapped_column(String(8), default="en")
    ip: Mapped[str | None] = mapped_column(String(64), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
