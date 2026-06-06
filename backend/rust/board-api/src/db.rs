use sea_orm::{
    ConnectOptions, ConnectionTrait, Database, DatabaseConnection, DbErr, Schema,
};
use std::time::Duration;

use crate::entity::post;

pub async fn connect(database_url: &str) -> Result<DatabaseConnection, DbErr> {
    let mut options = ConnectOptions::new(database_url.to_owned());
    options
        .max_connections(5)
        .min_connections(1)
        .connect_timeout(Duration::from_secs(8))
        .sqlx_logging(true);

    Database::connect(options).await
}

pub async fn init_schema(db: &DatabaseConnection) -> Result<(), DbErr> {
    let backend = db.get_database_backend();
    let schema = Schema::new(backend);

    let mut create_stmt = schema.create_table_from_entity(post::Entity);
    create_stmt.if_not_exists();
    let stmt = backend.build(&create_stmt);
    db.execute(stmt).await?;

    Ok(())
}
