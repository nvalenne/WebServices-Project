import DataType from "sequelize";

export const Message = (sequelize) => {
    return sequelize.define('messages', {
            username: {
                field: 'username',
                type: DataType.CHAR,
            },
            message: {
                field: 'message',
                type: DataType.CHAR,
            },
        }, {
            tableName: "messages",
            timestamps: true
        }
    );
}