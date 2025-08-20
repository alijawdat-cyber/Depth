import type { OnboardingFormData, OnboardingState, OnboardingStep, AccountCreationData, BasicInfoData, ExperienceData, PortfolioData, AvailabilityData } from '@/types/onboarding';
import type { EquipmentInventory } from '@/types/creators';
import { initialFormData, initialState } from './constants';

export type OnboardingAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_LOADING_MESSAGE'; payload: string }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SUCCESS'; payload: boolean }
  | { type: 'SET_CAN_PROCEED'; payload: boolean }
  | { type: 'MARK_FIELD_TOUCHED'; payload: string }
  | { type: 'SET_SHOW_VALIDATION'; payload: boolean }
  | { type: 'UPDATE_ACCOUNT'; payload: Partial<AccountCreationData> }
  | { type: 'UPDATE_BASIC_INFO'; payload: Partial<BasicInfoData> }
  | { type: 'UPDATE_EXPERIENCE'; payload: Partial<ExperienceData> }
  | { type: 'UPDATE_PORTFOLIO'; payload: Partial<PortfolioData> }
  | { type: 'UPDATE_AVAILABILITY'; payload: Partial<AvailabilityData> }
  | { type: 'UPDATE_EQUIPMENT'; payload: Partial<EquipmentInventory> }
  | { type: 'UPDATE_METADATA'; payload: Partial<OnboardingFormData['metadata']> }
  | { type: 'SET_CURRENT_STEP'; payload: OnboardingStep }
  | { type: 'COMPLETE_STEP'; payload: OnboardingStep }
  | { type: 'SET_HAS_INTERACTED'; payload: boolean }
  | { type: 'RESET_FORM' }
  | { type: 'LOAD_SAVED_DATA'; payload: Partial<OnboardingFormData> };

export function onboardingReducer(
  state: { formData: OnboardingFormData; uiState: OnboardingState },
  action: OnboardingAction
): { formData: OnboardingFormData; uiState: OnboardingState } {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, uiState: { ...state.uiState, loading: action.payload } };
    case 'SET_LOADING_MESSAGE':
      return { ...state, uiState: { ...state.uiState, loadingMessage: action.payload } };
    case 'SET_SAVING':
      return { ...state, uiState: { ...state.uiState, saving: action.payload } };
    case 'SET_ERROR':
      return { ...state, uiState: { ...state.uiState, error: action.payload } };
    case 'SET_SUCCESS':
      return { ...state, uiState: { ...state.uiState, success: action.payload } };
    case 'SET_CAN_PROCEED':
      return { ...state, uiState: { ...state.uiState, canProceed: action.payload } };
    case 'MARK_FIELD_TOUCHED':
      return { ...state, uiState: { ...state.uiState, touchedFields: new Set([...state.uiState.touchedFields, action.payload]) } };
    case 'SET_SHOW_VALIDATION':
      return { ...state, uiState: { ...state.uiState, showValidation: action.payload } };
    case 'UPDATE_ACCOUNT':
      return { ...state, formData: { ...state.formData, account: { ...state.formData.account, ...action.payload } } };
    case 'UPDATE_BASIC_INFO':
      return { ...state, formData: { ...state.formData, basicInfo: { ...state.formData.basicInfo, ...action.payload } } };
    case 'UPDATE_EXPERIENCE':
      return { ...state, formData: { ...state.formData, experience: { ...state.formData.experience, ...action.payload } } };
    case 'UPDATE_PORTFOLIO':
      return { ...state, formData: { ...state.formData, portfolio: { ...state.formData.portfolio, ...action.payload } } };
    case 'UPDATE_AVAILABILITY':
      return { ...state, formData: { ...state.formData, availability: { ...state.formData.availability, ...action.payload } } };
    case 'UPDATE_EQUIPMENT':
      return { ...state, formData: { ...state.formData, equipment: { cameras: [], lenses: [], lighting: [], audio: [], accessories: [], specialSetups: [], ...state.formData.equipment, ...action.payload } } };
    case 'UPDATE_METADATA':
      return { ...state, formData: { ...state.formData, metadata: { ...state.formData.metadata, ...action.payload } } };
    case 'SET_CURRENT_STEP':
      return { ...state, formData: { ...state.formData, currentStep: action.payload } };
    case 'COMPLETE_STEP':
      const completedSteps = [...state.formData.completedSteps];
      if (!completedSteps.includes(action.payload)) completedSteps.push(action.payload);
      return { ...state, formData: { ...state.formData, completedSteps: completedSteps.sort() } };
    case 'SET_HAS_INTERACTED':
      return { ...state, formData: { ...state.formData, hasInteracted: action.payload } };
    case 'RESET_FORM':
      return { formData: initialFormData, uiState: initialState };
    case 'LOAD_SAVED_DATA':
      return { ...state, formData: { ...state.formData, ...action.payload } };
    default:
      return state;
  }
}

export { initialFormData, initialState };
