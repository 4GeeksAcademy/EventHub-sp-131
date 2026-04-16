"""empty message

Revision ID: 5e62245a090b
Revises: 0763d677d453
Create Date: 2026-04-14 22:16:31.103866

"""
from alembic import op
import sqlalchemy as sa



revision = '5e62245a090b'
down_revision = '0763d677d453'
branch_labels = None
depends_on = None


def upgrade():
    
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('name', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('location', sa.String(length=150), nullable=True))
        batch_op.add_column(sa.Column('age', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('description', sa.String(length=500), nullable=True))

    
    op.execute("UPDATE \"user\" SET name = 'Sin nombre' WHERE name IS NULL")

    
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column('name', existing_type=sa.String(length=100), nullable=False)


def downgrade():
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_column('description')
        batch_op.drop_column('age')
        batch_op.drop_column('location')
        batch_op.drop_column('name')