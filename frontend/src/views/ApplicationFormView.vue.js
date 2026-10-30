/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useApplicationStore } from '@/stores/applications';
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const appStore = useApplicationStore();
const isEditMode = computed(() => !!route.params.id);
const applicationId = computed(() => Number(route.params.id));
const companyName = ref('');
const positionTitle = ref('');
const location = ref('');
const stipend = ref(null);
const startDate = ref('');
const endDate = ref('');
const status = ref('DRAFT');
const errorMessage = ref('');
onMounted(() => {
    if (isEditMode.value) {
        const existing = appStore.getById(applicationId.value);
        if (!existing) {
            router.push('/dashboard');
            return;
        }
        companyName.value = existing.companyName;
        positionTitle.value = existing.positionTitle;
        location.value = existing.location;
        stipend.value = existing.stipend ?? null;
        startDate.value = existing.startDate;
        endDate.value = existing.endDate;
        status.value = existing.status;
    }
});
function handleSubmit() {
    errorMessage.value = '';
    if (!companyName.value.trim() || companyName.value.trim().length < 2) {
        errorMessage.value = 'Company name must be at least 2 characters.';
        return;
    }
    if (!positionTitle.value.trim() || positionTitle.value.trim().length < 2) {
        errorMessage.value = 'Position title must be at least 2 characters.';
        return;
    }
    if (!location.value.trim()) {
        errorMessage.value = 'Location is required.';
        return;
    }
    if (!startDate.value || !endDate.value) {
        errorMessage.value = 'Both start date and end date are required.';
        return;
    }
    if (new Date(startDate.value) >= new Date(endDate.value)) {
        errorMessage.value = 'End date must be after start date.';
        return;
    }
    if (isEditMode.value) {
        appStore.updateApplication(applicationId.value, {
            companyName: companyName.value,
            positionTitle: positionTitle.value,
            location: location.value,
            stipend: stipend.value,
            startDate: startDate.value,
            endDate: endDate.value,
            status: status.value
        });
        router.push(`/applications/${applicationId.value}`);
    }
    else {
        const created = appStore.addApplication({
            studentId: authStore.currentUser?.id ?? 1,
            studentName: authStore.currentUser?.fullName ?? 'SOK Vireak',
            companyName: companyName.value,
            positionTitle: positionTitle.value,
            location: location.value,
            stipend: stipend.value,
            startDate: startDate.value,
            endDate: endDate.value,
            status: status.value
        });
        router.push(`/applications/${created.id}`);
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-header" },
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({
    ...{ class: "page-title" },
});
(__VLS_ctx.isEditMode ? 'Edit Internship Application' : 'New Internship Application');
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "page-subtitle" },
});
(__VLS_ctx.isEditMode
    ? 'Update the internship details and status'
    : 'Enter internship details for academic accreditation tracking');
if (__VLS_ctx.errorMessage) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ style: {} },
    });
    (__VLS_ctx.errorMessage);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.form, __VLS_intrinsicElements.form)({
    ...{ onSubmit: (__VLS_ctx.handleSubmit) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "form-label" },
    for: "app-company",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    id: "app-company",
    value: (__VLS_ctx.companyName),
    type: "text",
    ...{ class: "form-input" },
    placeholder: "e.g. Smart Axiata Co., Ltd.",
    required: true,
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "form-label" },
    for: "app-position",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    id: "app-position",
    value: (__VLS_ctx.positionTitle),
    type: "text",
    ...{ class: "form-input" },
    placeholder: "e.g. Backend Software Engineering Intern",
    required: true,
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "form-label" },
    for: "app-location",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    id: "app-location",
    value: (__VLS_ctx.location),
    type: "text",
    ...{ class: "form-input" },
    placeholder: "e.g. Phnom Penh or Remote",
    required: true,
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "form-label" },
    for: "app-stipend",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    id: "app-stipend",
    type: "number",
    min: "0",
    step: "10",
    ...{ class: "form-input" },
    placeholder: "e.g. 350",
});
(__VLS_ctx.stipend);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "form-label" },
    for: "app-start-date",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    id: "app-start-date",
    type: "date",
    ...{ class: "form-input" },
    required: true,
});
(__VLS_ctx.startDate);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "form-label" },
    for: "app-end-date",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
    id: "app-end-date",
    type: "date",
    ...{ class: "form-input" },
    required: true,
});
(__VLS_ctx.endDate);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "form-group" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.label, __VLS_intrinsicElements.label)({
    ...{ class: "form-label" },
    for: "app-status",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
    id: "app-status",
    value: (__VLS_ctx.status),
    ...{ class: "form-select" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "DRAFT",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "APPLIED",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "INTERVIEWING",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
    value: "OFFERED",
});
if (__VLS_ctx.isEditMode) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "APPROVED",
    });
}
if (__VLS_ctx.isEditMode) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
        value: "REJECTED",
    });
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ style: {} },
});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/dashboard",
    ...{ class: "btn btn-secondary" },
}));
const __VLS_2 = __VLS_1({
    to: "/dashboard",
    ...{ class: "btn btn-secondary" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    type: "submit",
    ...{ class: "btn btn-primary" },
});
(__VLS_ctx.isEditMode ? 'Save Changes' : 'Create Application');
/** @type {__VLS_StyleScopedClasses['card']} */ ;
/** @type {__VLS_StyleScopedClasses['page-header']} */ ;
/** @type {__VLS_StyleScopedClasses['page-title']} */ ;
/** @type {__VLS_StyleScopedClasses['page-subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-input']} */ ;
/** @type {__VLS_StyleScopedClasses['form-group']} */ ;
/** @type {__VLS_StyleScopedClasses['form-label']} */ ;
/** @type {__VLS_StyleScopedClasses['form-select']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            isEditMode: isEditMode,
            companyName: companyName,
            positionTitle: positionTitle,
            location: location,
            stipend: stipend,
            startDate: startDate,
            endDate: endDate,
            status: status,
            errorMessage: errorMessage,
            handleSubmit: handleSubmit,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
