import navigation from '../_nav';

if (!Array.prototype.indexOfPropValue) {
    Array.prototype.indexOfPropValue = function (prop, value) {
        for (var i = 0; i < this.length; ++i) {
            if (this[i][prop]) {
                if (this[i][prop] === value) {
                    return i;
                }
            }
        }
        return -1;
    };
}


if (!Array.prototype.convertArrayToObject) {
    Array.prototype.convertArrayToObject = (key) => {
        const initialValue = {};
        return this.reduce((obj, item) => {
            return {
                ...obj,
                [item[key]]: item,
            };
        }, initialValue);
    };
}

export const convertArrayToObject = (array, key) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
        return {
            ...obj,
            [item[key]]: item.permission,
        };
    }, initialValue);
};

export const maskCurrency = (value, maxLength = 12, radix = ",") => {
    const currencyRegExp = new RegExp(
        `(\\d{1,${maxLength - 3}})(,)?(\\d{2})`,
        "g"
    );
    return value.replace(currencyRegExp, (match, p1, p2, p3) =>
        [p1, p3].join(radix)
    );
};

export const parseToMenu = (menus, roleId) => {
    if(roleId === 1) return navigation.items;

    const newMenus = [];

    for (let i = 0; i < menus.length; i++) {
        let menu = {
            id: menus[i].id,
            name: menus[i].title,
            icon: menus[i].icon,
            children: [],
        }

        if (menus[i].level) {
            // const idx = newMenus.indexOf({ id: menus.parent_id });
            const idx = newMenus.indexOfPropValue('id', menus[i].parent_id);
            if (idx !== -1) {
                newMenus[idx].children.push({
                    name: menus[i].title,
                    icon: menus[i].icon,
                    url: menus[i].path,
                });
            }
        } else {
            newMenus.push(menu);
        }
    }

    return newMenus;
};

// export const objectIndexOf()