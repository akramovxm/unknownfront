import {Injectable} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from "@angular/material/tree";
import {FlatTreeControl} from "@angular/cdk/tree";
import {SelectionModel} from "@angular/cdk/collections";
import {CdkDragDrop} from "@angular/cdk/drag-drop";
import {ChangedTopic} from "../models/changed-topic";
import {AdminTreeTopic} from "@features/admin/topics/models/admin-tree-topic";

@Injectable({
    providedIn: 'root'
})
export class TopicTreeService {
    treeControl: FlatTreeControl<TopicNode>;
    treeFlattener: MatTreeFlattener<AdminTreeTopic, TopicNode>;
    dataSource: MatTreeFlatDataSource<AdminTreeTopic, TopicNode>;
    expansionModel = new SelectionModel<number>(true);

    changedTopics: ChangedTopic[] = [];

    constructor() {
        this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel, this._isExpandable, this._getChildren);
        this.treeControl = new FlatTreeControl<TopicNode>(this._getLevel, this._isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    }

    transformer = (topic: AdminTreeTopic, level: number) => {
        return new TopicNode(topic, topic.children.length > 0, level);
    }
    private _getLevel = (node: TopicNode) => node.level;
    private _isExpandable = (node: TopicNode) => node.expandable;
    private _getChildren = (topic: AdminTreeTopic): AdminTreeTopic[] => topic.children;

    visibleNodes() {
        const result: AdminTreeTopic[] = [];

        function addExpandedChildren(node: AdminTreeTopic, expanded: number[]) {
            result.push(node);
            if (expanded.includes(node.id)) {
                node.children.map(ch => addExpandedChildren(ch, expanded));
            }
        }

        this.dataSource.data.forEach(topic => {
            addExpandedChildren(topic, this.expansionModel.selected);
        });
        return result;
    }

    findTopic(topics: AdminTreeTopic[], id: number): AdminTreeTopic | undefined {
        let result, subResult;
        topics.forEach(item => {
            if (item.id === id) {
                result = item;
            } else if (item.children.length > 0) {
                subResult = this.findTopic(item.children, id);
                if (subResult) result = subResult;
            }
        });
        return result;
    }

    findLastTopic(topic: AdminTreeTopic): AdminTreeTopic | undefined {
        if (topic === undefined) return undefined;
        if (topic.children.length === 0) {
            return topic;
        }
        const last = topic.children[topic.children.length - 1];
        return this.findLastTopic(last);
    }

    findNodeSiblings(topics: AdminTreeTopic[], id: number): AdminTreeTopic[] | undefined {
        let result, subResult;
        topics.forEach(item => {
            if (item.id === id) {
                result = topics;
            } else if (item.children.length > 0) {
                subResult = this.findNodeSiblings(item.children, id);
                if (subResult) result = subResult;
            }
        });
        return result;
    }

    drop(e: CdkDragDrop<AdminTreeTopic>) {
        if (!e.isPointerOverContainer) return;

        const topics = this.dataSource.data;
        const items = e.container.getSortedItems();

        const previousIndex = e.previousIndex;
        const currentIndex = e.currentIndex;

        const topic = e.item.data.topic;

        const placeTopic = items[currentIndex].data.topic;

        let beforePrevTopic = undefined;
        if (previousIndex > 0) {
            beforePrevTopic = items[previousIndex - 1].data.topic;
        }

        let beforeNextTopic = undefined;
        if (previousIndex < items.length - 1) {
            beforeNextTopic = items[previousIndex + 1].data.topic;
        }

        let afterPrevTopic = undefined;
        if (currentIndex > 0) {
            if (previousIndex < currentIndex) {
                afterPrevTopic = items[currentIndex].data.topic;
            } else {
                afterPrevTopic = items[currentIndex - 1].data.topic;
            }
        }

        let afterNextTopic = undefined;
        if (currentIndex < items.length - 1) {
            if (previousIndex < currentIndex) {
                afterNextTopic = items[currentIndex + 1].data.topic;
            } else {
                afterNextTopic = items[currentIndex].data.topic;
            }
        }

        const nodeAtDest = this.visibleNodes()[e.currentIndex];
        const newSiblings = this.findNodeSiblings(topics, nodeAtDest.id);
        if (!newSiblings) return;
        let insertIndex = newSiblings.findIndex(s => s.id === nodeAtDest.id);

        const siblings = this.findNodeSiblings(topics, topic.id);
        if (!siblings) return;
        const siblingIndex = siblings.findIndex(n => n.id === topic.id);
        const nodeToInsert = siblings.splice(siblingIndex, 1)[0];
        if (nodeAtDest.id === nodeToInsert.id) return;

        if (topic.parent?.id !== placeTopic.parent?.id
            && e.previousIndex < e.currentIndex) {
            insertIndex++;
        }

        newSiblings.splice(insertIndex, 0, nodeToInsert);

        this.rebuildTreeForData(topics);

        const beforePrevTopicLastTopic = this.findLastTopic(beforePrevTopic);
        if (beforePrevTopicLastTopic) {
            beforePrevTopicLastTopic.next = beforeNextTopic;
        }

        if (beforeNextTopic) {
            beforeNextTopic.prev = beforePrevTopicLastTopic;
        }

        for (let i = 0; i < siblings.length; i++) {
            siblings[i].seq = i + 1;
        }

        const afterPrevTopicLastTopic = this.findLastTopic(afterPrevTopic);
        if (afterPrevTopicLastTopic) {
            afterPrevTopicLastTopic.next = topic;
        }

        topic.prev = afterPrevTopicLastTopic;
        const lastTopic = this.findLastTopic(topic);
        if (lastTopic) {
            lastTopic.next = afterNextTopic;
        }

        if (afterNextTopic) {
            afterNextTopic.prev = lastTopic;
        }

        if (topic.parent?.id !== placeTopic.parent?.id) {
            for (let i = 0; i < newSiblings.length; i++) {
                newSiblings[i].seq = i + 1;
            }

            if (topic) {
                topic.parent = placeTopic.parent;
            }
        }

        const last: any = this.findLastTopic(topic);

        const topicRequest = new ChangedTopic(
            topic.id,
            topic.seq,
            topic.prev?.id,
            last?.next.id,
            topic.parent?.id
        );

        const i = this.changedTopics.findIndex(t => t.id === topic.id);

        if (i === -1) {
            this.changedTopics.push(topicRequest);
        } else {
            this.changedTopics[i] = topicRequest;
        }
    }

    rebuildTreeForData(data: AdminTreeTopic[]) {
        this.dataSource.data = data;
        this.expansionModel.selected.forEach(id => {
            const node = this.treeControl.dataNodes.find(n => n.topic.id === id);
            if (node) {
                this.treeControl.expand(node);
            }
        });
    }
}

export class TopicNode {
    constructor(
        public topic: AdminTreeTopic,
        public expandable: boolean,
        public level: number
    ) {
    }
}