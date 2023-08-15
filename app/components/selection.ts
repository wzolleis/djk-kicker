import {useState} from "react";

export interface DataWithId {
    id: string
}

export type UseSelectionListProps<T extends DataWithId> = {
    items: T[]
    sortFn?: (t1: T, t2: T) => number
}

export const useItemSelectionList = <T extends DataWithId>(props: UseSelectionListProps<T>) => {
    const {items, sortFn} = props
    const sorted = [...items].sort(sortFn)

    const [includedItems, setIncludedItems] = useState(sorted)
    const [excludedItems, setExcludedItems] = useState(Array<T>);

    const removeFromArrayById = (items: Array<T>, itemId: string): Array<T> => {
        return items.filter(p => p.id !== itemId).sort(sortFn)
    }

    const removeItemFromIncluded = (item: T) => {
        setIncludedItems(removeFromArrayById(includedItems, item.id))
        setExcludedItems([...excludedItems, item].sort(sortFn))
    }

    const addItemToIncludedList = (item: T) => {
        setExcludedItems(removeFromArrayById(excludedItems, item.id))
        setIncludedItems([...includedItems, item].sort(sortFn))
    }

    const addAllItemsToIncluded = () => {
        setIncludedItems([...items].sort(sortFn))
        setExcludedItems([])
    }

    const removeAllItemsFromIncluded = () => {
        setIncludedItems([])
        setExcludedItems([...items].sort(sortFn))
    }

    const isItemIncluded = (data: T) => {
        return includedItems.some((value) => value.id === data.id)
    }

    const handleItemSelection = (item: T) => {
        if (isItemIncluded(item)) {
            removeItemFromIncluded(item)
        } else {
            addItemToIncludedList(item)
        }
    }


    return {handleItemSelection, includedItems, excludedItems, addAllItemsToIncluded, removeAllItemsFromIncluded, isItemIncluded}

}